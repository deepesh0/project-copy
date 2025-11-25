"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enum_types_1 = require("../@types/enum.types");
//? user schema
const userSchema = new mongoose_1.default.Schema({
    first_name: {
        type: String,
        requred: [true, 'first_name is reuired'],
        trim: true
    },
    last_name: {
        type: String,
        requred: [true, 'last_name is reuired'],
        trim: true
    },
    email: {
        type: String,
        requred: [true, 'email is reuired'],
        unique: [true, 'user already exists with provided email'],
        trim: true
    },
    password: {
        type: String,
        requred: [true, 'password is reuired'],
        minLength: 6
    },
    role: {
        type: String,
        enum: Object.values(enum_types_1.Role),
        default: enum_types_1.Role.USER
    },
    profile_image: {
        type: {
            path: String,
            public_id: String
        }
    },
    phone: {
        type: String
    }
}, { timestamps: true });
//? user model
const User = mongoose_1.default.model('user', userSchema);
exports.default = User;
