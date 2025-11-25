import { Role } from "./enum.types"
import mongoose  from 'mongoose';

export interface Iplayload{
    _id:mongoose.Types.ObjectId,
    role:Role,
    email:string,
    first_name:string
    last_name:string
}