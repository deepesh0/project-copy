//create
import { asyncHandler } from "../utils/asynchandler.utils";
import { Request } from "express";
import { Response } from "express";
import Product from "../models/product.models";
import CustomError from "../middlewares/error_handler.middleware";
import WishList from "../models/wishlist.model";


export const create = asyncHandler(async (req: Request, res: Response) => {
  const { product_id } = req.body;
  const user_id = req.user?._id
  let wishlist = null

  const product = await Product.findOne({ _id: product_id });

    if (!product) {
    throw new CustomError("Product not found", 404);
    }
  const is_exists = await WishList.findOne({user: user_id, product: product_id}) 


if (is_exists){
    await is_exists.deleteOne()
} else {
    wishlist = await WishList.create({user: user_id, product: product_id})
}


  res.status(200).json({
    message: is_exists ? 'Product Removed' : "Product added to wishlist",
    data: wishlist,
    status: "success",
  });
});

//clear all
export const clearAll = asyncHandler(async (req:Request, res:Response) => {
    const user_id = req.user?._id

    await WishList.deleteMany({user: user_id})
      res.status(200).json({
    message: "Product deleted from wishlist",
    data: null,
    status: "success",
      })
})



// remove



// getall
export const getAll = asyncHandler(async (req:Request, res:Response) => {
    const user_id = req.user?._id

     const list =await WishList.find({user: user_id})
      res.status(200).json({
    message: "Your wishlist",
    data: list,
    status: "success",
      })

})


