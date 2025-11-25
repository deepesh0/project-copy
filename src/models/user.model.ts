import mongoose from 'mongoose'
import { Role } from '../@types/enum.types';

//? user schema
const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        requred: [true, 'first_name is reuired'],
        trim:true
    },
      last_name: {
        type: String,
        requred: [true, 'last_name is reuired'],
        trim:true
    },
    email: {
        type: String,
        requred: [true, 'email is reuired'],
        unique: [true, 'user already exists with provided email'],
        trim:true
    },
     password: {
        type: String,
        requred: [true, 'password is reuired'],
        minLength:6
    },
    role: {
        type: String,
        enum: Object.values(Role),
        default:Role.USER
    },
    profile_image: {
        type: {
            path: String,
            public_id:String
        }
    },
    phone: {
        type:String
    }

}, { timestamps: true });


//? user model
const User = mongoose.model('user', userSchema);

export default User;