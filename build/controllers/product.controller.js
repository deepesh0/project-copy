"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductByArrival = exports.getProductByFeature = exports.getProductByCategory = exports.delete_product = exports.update = exports.create = exports.getByID = exports.getAll = void 0;
const asynchandler_utils_1 = require("../utils/asynchandler.utils");
const product_models_1 = __importDefault(require("../models/product.models"));
const error_handler_middleware_1 = __importDefault(require("../middlewares/error_handler.middleware"));
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const brand_model_1 = __importDefault(require("../models/brand.model"));
const category_model_1 = __importDefault(require("../models/category.model"));
const dir = "/products";
//getall
exports.getAll = (0, asynchandler_utils_1.asyncHandler)(async (req, res, next) => {
    const product = await product_models_1.default.find({}).populate('category').populate('brand');
    res.status(200).json({
        message: "Products Fetched",
        data: product,
        status: "success",
    });
});
//getByID
exports.getByID = (0, asynchandler_utils_1.asyncHandler)(async (req, res, next) => {
    const { id } = req.params;
    const product = await product_models_1.default.findById({ _id: id }).populate('category').populate('brand');
    if (!product) {
        throw new error_handler_middleware_1.default("Product not found", 404);
    }
    res.status(200).json({
        message: "Product Fetched",
        status: "success",
        data: product,
    });
});
//create
exports.create = (0, asynchandler_utils_1.asyncHandler)(async (req, res, next) => {
    const { name, description, price, stock, category, brand, is_featured, new_arrival, } = req.body;
    const { cover_image, images } = req.files;
    const product = new product_models_1.default({
        name,
        description,
        price,
        stock,
        is_featured,
        new_arrival,
    });
    if (cover_image) {
        const { path, public_id } = await (0, cloudinary_utils_1.upload)(cover_image[0].path, dir);
        product.cover_image = { path, public_id };
    }
    if (images && images.length > 0) {
        const promises = images.map(async (image) => await (0, cloudinary_utils_1.upload)(image.path, dir));
        const product_images = await Promise.all(promises);
    }
    if (brand) {
        const product_brand = await brand_model_1.default.findOne({ _id: brand });
        if (!product_brand) {
            throw new error_handler_middleware_1.default("Brand not found", 400);
        }
        product.brand = product_brand._id;
    }
    if (category) {
        const product_category = await category_model_1.default.findById({ _id: category });
        if (!product_category) {
            throw new error_handler_middleware_1.default("category not found", 400);
        }
        product.category = product_category._id;
    }
    await product.validate();
    await product.save();
    res.status(200).json({
        message: "Product Added",
        status: "success",
        data: product,
    });
});
//update
exports.update = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { name, description, price, is_featured, new_arrival, category, brand, deleted_image, } = req.body;
    const { cover_image, images } = req.files;
    const product = await product_models_1.default.findById({ _id: id });
    if (!product) {
        throw new error_handler_middleware_1.default("Product not found", 400);
    }
    if (name)
        product.name = name;
    if (description)
        product.description = description;
    if (price)
        product.price = price;
    if (is_featured)
        product.is_featured = is_featured;
    if (new_arrival)
        product.new_arrival = new_arrival;
    if (category) {
        const new_category = await category_model_1.default.findById({ _id: category });
        if (!new_category)
            throw new error_handler_middleware_1.default("Category not found", 404);
        product.category = new_category._id;
    }
    if (brand) {
        const new_brand = await brand_model_1.default.findById({ _id: brand });
        if (!new_brand)
            throw new error_handler_middleware_1.default("Brand not found", 404);
        product.brand = new_brand._id;
    }
    if (cover_image && cover_image.length > 0) {
        await (0, cloudinary_utils_1.deletefile)(product.cover_image.public_id);
        const { path, public_id } = await (0, cloudinary_utils_1.upload)(cover_image[0].path, dir);
        product.cover_image = { path, public_id };
    }
    if (deleted_image &&
        Array.isArray(deleted_image) &&
        deleted_image.length > 0) {
        deleted_image.map(async (public_id) => await (0, cloudinary_utils_1.deletefile)(public_id));
        product.images = product.images?.filter((img) => !deleted_image.includes(img.public_id));
    }
    if (images && images.length > 0) {
        // if (
        //   deleted_image &&
        //   Array.isArray(deleted_image) &&
        //   deleted_image.length > 0
        // ) {
        //   deleted_image.map(async (public_id) => await deletefile(public_id));
        // }
        const uploaded_images = await Promise.all(images.map(async (img) => await (0, cloudinary_utils_1.upload)(img.path, dir)));
        product.images = [...uploaded_images, ...product.images];
    }
    await product.save();
    res.status(200).json({
        message: "Product Updated",
        data: product,
        status: "success",
    });
});
//delete
exports.delete_product = (0, asynchandler_utils_1.asyncHandler)(async (req, res, next) => {
    const { id } = req.params;
    const product = await product_models_1.default.findById({ _id: id });
    if (!product) {
        throw new error_handler_middleware_1.default("Product not found", 401);
    }
    await (0, cloudinary_utils_1.deletefile)(product.cover_image.public_id);
    if (product.images && product.images.length > 0) {
        product.images.map(async (img) => await (0, cloudinary_utils_1.deletefile)(img?.public_id));
    }
    res.status(200).json({
        message: "Product removed",
        status: "success",
    });
});
// get by category
exports.getProductByCategory = (0, asynchandler_utils_1.asyncHandler)(async (req, res, next) => {
    const { category_id } = req.params;
    const products = await product_models_1.default.find({ category: category_id }).populate('category').populate('brand');
    res.status(200).json({
        message: "Product Fetched",
        status: "success",
        data: products,
    });
});
// get featured products
exports.getProductByFeature = (0, asynchandler_utils_1.asyncHandler)(async (req, res, next) => {
    const product = await product_models_1.default.find({ is_featured: true }).populate('category').populate('brand');
    res.status(200).json({
        message: "Product Fetched",
        status: "success",
        data: product,
    });
});
// get new arrival products
exports.getProductByArrival = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const product = await product_models_1.default.find({ new_arrival: true }).populate('category').populate('brand');
    res.status(200).json({
        message: "Product Fetched",
        status: "success",
        data: product,
    });
});
