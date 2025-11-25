import mongoose from 'mongoose'

//user, product -->id

const wishLisstSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required:[true,'User is required']
    },
       product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'prodct',
        required:[true,'User is required']
    }

},{timestamps:true})

const WishList = mongoose.model('wishlist', wishLisstSchema)
export default WishList
