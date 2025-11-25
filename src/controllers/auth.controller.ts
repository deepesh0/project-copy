import { NextFunction, Request, RequestHandler, Response } from "express";
import User from "../models/user.model";
import { comparePassword, hashPassword } from "../utils/bcrypt.utils";
import CustomError from "../middlewares/error_handler.middleware";
import { asyncHandler } from "../utils/asynchandler.utils";
import {upload} from "../utils/cloudinary.utils"
import { generateToken } from '../utils/jwt.utils';
import { sendEmail } from '../utils/nodemailer.utils';

//? register user
export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { first_name, last_name, email, password, phone } = req.body;
    const file =req.file

    if (!password) {
      throw new CustomError("Password is required", 400);
    }

    const user = new User({ first_name, last_name, email, phone });

    const hashedPass = await hashPassword(password);

    // update user password to hashed password
    user.password = hashedPass;

    //! image

    if(file){
      const {path , public_id} = await upload(file?.path,'/profile_images')
      user.profile_image ={
        path,
        public_id
      
    }
  }

    //! save user
    await user.save();

    res.status(201).json({
      message: "Account created",
      status: "success",
      data: user,
    });
  }
);

//? login
export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;
        
        // console.log(email)

    if (!email) {
      throw new CustomError("Email is required", 400);
    }
    if (!password) {
      throw new CustomError("Password is required", 400);
    }

    //* check if user exists
    const user = await User.findOne({ email });

        // console.log(user)
    if (!user) {
      throw new CustomError("email or password does not match", 400);
    }

    //* compare password
    const isPassMatch = await comparePassword(password, user?.password || "");

    if (!isPassMatch) {
      throw new CustomError("email or password does not match", 400);
    }

    //! generate jwt token
    const access_token = generateToken({
      _id:user._id,
      email:user.email as string,
      first_name: user.first_name as string,
      last_name: user.last_name as string,
      role:user.role,

    })
    await sendEmail({
      html:"<h1>Login Succesfull</h1>",
      subject: 'Login to account',
      to: user?.email || ''
    })

    res
    .cookie('access_token', access_token,{
      sameSite:'none',
      httpOnly:true,
      secure: process.env.NODE_ENV ==='development'? false : true,
      maxAge: Number(process.env.COOKIE_EXPIRES_IN || '7') * 24 * 60 * 60 * 1000 
    })
    .status(201).json({
      message: "Login successfull",
      status: "success",
      data: user,
      access_token
    });
  }
);


// change pass
// const changePassword = asyncHandler(async (req:Request,res:Response) => {
//     // api logic
// })