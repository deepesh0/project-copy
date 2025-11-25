"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletefile = exports.upload = void 0;
const cloudinary_config_1 = __importDefault(require("../config/cloudinary.config"));
const error_handler_middleware_1 = __importDefault(require("../middlewares/error_handler.middleware"));
const fs_1 = __importDefault(require("fs"));
const upload = async (file, dir = '/') => {
    try {
        const folder = '/class project' + dir;
        const { public_id, secure_url } = await cloudinary_config_1.default.uploader.upload(file, {
            folder,
            unique_filename: true
        });
        if (fs_1.default.existsSync(file)) {
            fs_1.default.unlinkSync(file);
        }
        return {
            public_id,
            path: secure_url
        };
    }
    catch (error) {
        console.log(error);
        throw new error_handler_middleware_1.default('File upload error', 500);
    }
};
exports.upload = upload;
const deletefile = async (public_id) => {
    try {
        await cloudinary_config_1.default.uploader.destroy(public_id);
    }
    catch (error) {
        throw new error_handler_middleware_1.default("file delete error", 500);
    }
};
exports.deletefile = deletefile;
