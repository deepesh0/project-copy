import CustomError from "../middlewares/error_handler.middleware";
import Product from "../models/product.models";
import { asyncHandler } from "../utils/asynchandler.utils";
import { Request, Response } from "express";
import Cart from "../models/cart.models";

export const create = asyncHandler(async (req: Request, res: Response) => {
  const user_id = req.user?._id;
  const { product_id, quantity = 1 } = req.body;
  let cart = null;

  const product = await Product.findOne({ _id: product_id });
  if (!product) {
    throw new CustomError("Product not Found", 404);
  }

  cart = await Cart.findOne({ user: user_id });

  if (cart) {
    const product_exists = cart.items.find(
      (item) => item.product === product._id
    );
    if (product_exists) {
      product_exists.quantity = Number(quantity);
    } else {
      cart.items.push({
        product: product_id,
        quantity: Number(quantity),
      });
    }
  } else {
    cart = new Cart({
      user: user_id,
      items: [{ product: product_id, quantity: quantity }],
    });
  }
  await cart.save();

  res.status(200).json({
    message: "Cart created",
    data: cart,
    status: "success",
  });
});

//getall

export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const user_id = req.user?._id;
  const cart = await Cart.findOne({ user: user_id });
  if (!cart) {
    throw new CustomError("Cart not found", 404);
  }
  res.status(200).json({
    message: "Cart Fetched",
    data: cart,
    status: "success",
  });
});

export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const user_id = req.user?._id;
  const cart: any = await Cart.findOne({ user: user_id })
    .populate("user")
    .populate("items.product");
  if (!cart) {
    throw new CustomError("Cart not found", 404);
  }
  //process
  cart.total_amount = cart.items.reduce((acc: number, item: any) => {
    return acc + item.product.price * item.quantity;
  });

  res.status(200).json({
    message: "Cart Fetched",
    data: cart,
    status: "success",
  });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user?._id;
  const product = req.body;

  const cart = await Cart.findOne({ user: user });
  if (!cart) {
    throw new CustomError("Cart not found", 404);
  }
  const items = cart.items.filter(
    (item) => item.product?.toString() !== product.toString()
  );
  cart.items = items as any;
  await cart.save();

  res.status(200).json({
    message: "Cart Fetched",
    data: cart,
    status: "success",
  });
});
//delete

export const clearAll = asyncHandler(async (req: Request, res: Response) => {
  const user_id = req.user?._id;

  const cart =await Cart.findOne({ user: user_id });
  if (!cart){
    throw new CustomError("cart not found",404);
    
  }
  cart.items  = [] as any
  await cart.save();


  res.status(200).json({
    message: "cart cleared ",
    data: null,
    status: "success",
  });
});
