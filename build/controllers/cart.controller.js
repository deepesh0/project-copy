"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearAll = exports.remove = exports.getCart = exports.getAll = exports.create = void 0;
const error_handler_middleware_1 = __importDefault(require("../middlewares/error_handler.middleware"));
const product_models_1 = __importDefault(require("../models/product.models"));
const asynchandler_utils_1 = require("../utils/asynchandler.utils");
const cart_models_1 = __importDefault(require("../models/cart.models"));
exports.create = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const user_id = req.user?._id;
    const { product_id, quantity = 1 } = req.body;
    let cart = null;
    const product = await product_models_1.default.findOne({ _id: product_id });
    if (!product) {
        throw new error_handler_middleware_1.default("Product not Found", 404);
    }
    cart = await cart_models_1.default.findOne({ user: user_id });
    if (cart) {
        const product_exists = cart.items.find((item) => item.product === product._id);
        if (product_exists) {
            product_exists.quantity = Number(quantity);
        }
        else {
            cart.items.push({
                product: product_id,
                quantity: Number(quantity),
            });
        }
    }
    else {
        cart = new cart_models_1.default({
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
exports.getAll = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const user_id = req.user?._id;
    const cart = await cart_models_1.default.findOne({ user: user_id });
    if (!cart) {
        throw new error_handler_middleware_1.default("Cart not found", 404);
    }
    res.status(200).json({
        message: "Cart Fetched",
        data: cart,
        status: "success",
    });
});
exports.getCart = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const user_id = req.user?._id;
    const cart = await cart_models_1.default.findOne({ user: user_id })
        .populate("user")
        .populate("items.product");
    if (!cart) {
        throw new error_handler_middleware_1.default("Cart not found", 404);
    }
    //process
    cart.total_amount = cart.items.reduce((acc, item) => {
        return acc + item.product.price * item.quantity;
    });
    res.status(200).json({
        message: "Cart Fetched",
        data: cart,
        status: "success",
    });
});
exports.remove = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const user = req.user?._id;
    const product = req.body;
    const cart = await cart_models_1.default.findOne({ user: user });
    if (!cart) {
        throw new error_handler_middleware_1.default("Cart not found", 404);
    }
    const items = cart.items.filter((item) => item.product?.toString() !== product.toString());
    cart.items = items;
    await cart.save();
    res.status(200).json({
        message: "Cart Fetched",
        data: cart,
        status: "success",
    });
});
//delete
exports.clearAll = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const user_id = req.user?._id;
    const cart = await cart_models_1.default.findOne({ user: user_id });
    if (!cart) {
        throw new error_handler_middleware_1.default("cart not found", 404);
    }
    cart.items = [];
    await cart.save();
    res.status(200).json({
        message: "cart cleared ",
        data: null,
        status: "success",
    });
});
