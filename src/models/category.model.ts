// name , description , image

import mongoose from "mongoose";

// category schema
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        unique:[true,'category already exists with given name'],
        trim:true,
    },
    description: {
        type: String,
        trim:true
    },
    image: {
        type: {
            path: String,
            public_id:String
        }
    }
}, {
    timestamps:true
})


const Category = mongoose.model('category', categorySchema)
export default Category;