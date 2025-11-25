import mongoose from "mongoose";

// category schema
const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        unique:[true,'Brand already exists with given name'],
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


const Brand = mongoose.model('brand', brandSchema)
export default Brand;