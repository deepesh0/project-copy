"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_utils_1 = require("../utils/bcrypt.utils");
const error_handler_middleware_1 = __importDefault(require("../middlewares/error_handler.middleware"));
const asynchandler_utils_1 = require("../utils/asynchandler.utils");
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const jwt_utils_1 = require("../utils/jwt.utils");
const nodemailer_utils_1 = require("../utils/nodemailer.utils");
//? register user
exports.register = (0, asynchandler_utils_1.asyncHandler)(async (req, res, next) => {
    const { first_name, last_name, email, password, phone } = req.body;
    const file = req.file;
    if (!password) {
        throw new error_handler_middleware_1.default("Password is required", 400);
    }
    const user = new user_model_1.default({ first_name, last_name, email, phone });
    const hashedPass = await (0, bcrypt_utils_1.hashPassword)(password);
    // update user password to hashed password
    user.password = hashedPass;
    //! image
    if (file) {
        const { path, public_id } = await (0, cloudinary_utils_1.upload)(file?.path, "/profile_images");
        user.profile_image = {
            path,
            public_id,
        };
    }
    //! save user
    await user.save();
    res.status(201).json({
        message: "Account created",
        status: "success",
        data: user,
    });
});
//? login
exports.login = (0, asynchandler_utils_1.asyncHandler)(async (req, res, next) => {
    const { email, password } = req.body;
    // console.log(email)
    if (!email) {
        throw new error_handler_middleware_1.default("Email is required", 400);
    }
    if (!password) {
        throw new error_handler_middleware_1.default("Password is required", 400);
    }
    //* check if user exists
    const user = await user_model_1.default.findOne({ email });
    // console.log(user)
    if (!user) {
        throw new error_handler_middleware_1.default("email or password does not match", 400);
    }
    //* compare password
    const isPassMatch = await (0, bcrypt_utils_1.comparePassword)(password, user?.password || '');
    if (!isPassMatch) {
        throw new error_handler_middleware_1.default("email or password does not match", 400);
    }
    //! generate jwt token
    const access_token = (0, jwt_utils_1.generateToken)({
        _id: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
    });
    await (0, nodemailer_utils_1.sendEmail)({
        html: "<h1>Login Succesfull</h1>",
        subject: "Login to account",
        to: user?.email || "",
    });
    res
        .cookie("access_token", access_token, {
        sameSite: "none",
        httpOnly: true,
        secure: process.env.NODE_ENV === "development" ? false : true,
        maxAge: Number(process.env.COOKIE_EXPIRES_IN || "7") * 24 * 60 * 60 * 1000,
    })
        .status(201)
        .json({
        message: "Login successfull",
        status: "success",
        data: user,
        access_token,
    });
});
// change pass
// const changePassword = asyncHandler(async (req:Request,res:Response) => {
//     // api logic
// })
