import mongoose from 'mongoose'

//user, product -->id

const cartSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required:[true,'User is required']
    },
    items:[
        {
       product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'prodct',
        required:[true,'User is required']
    },
    quantity:{
        type: Number
    }
}]

},{timestamps:true})

const cart = mongoose.model('cart', cartSchema)
export default cart