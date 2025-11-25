"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.delete_category = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const asynchandler_utils_1 = require("../utils/asynchandler.utils");
const category_model_1 = __importDefault(require("../models/category.model"));
const error_handler_middleware_1 = __importDefault(require("../middlewares/error_handler.middleware"));
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const dir = "/categories";
exports.getAll = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const categories = await category_model_1.default.find({});
    res.status(200).json({
        message: "Category fetched",
        status: "success",
        data: categories,
    });
});
// get by id
exports.getById = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const category = await category_model_1.default.findOne({ _id: id });
    if (!category_model_1.default) {
        throw new error_handler_middleware_1.default("Category not found", 404);
    }
    res
        .status(200)
        .json({ message: "category fetched", status: "success", data: category });
});
// create
exports.create = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const { name, description } = req.body;
    const file = req.file;
    if (!file) {
        throw new error_handler_middleware_1.default("Image is required", 400);
    }
    const category = new category_model_1.default({ name, description });
    const { path, public_id } = await (0, cloudinary_utils_1.upload)(file.path, dir);
    category.image = {
        path,
        public_id,
    };
    category.save();
    res.status(201).json({
        message: "category created",
        data: category,
        status: "success",
    });
});
// update
exports.update = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const file = req.file;
    const category = await category_model_1.default.findById({ _id: id });
    if (!category) {
        throw new error_handler_middleware_1.default("Category not found", 404);
    }
    if (name) {
        category.name = name;
    }
    if (description) {
        category.description = description;
    }
    if (file) {
        if (category.image) {
            await (0, cloudinary_utils_1.deletefile)(category.image.public_id);
        }
        const { path, public_id } = await (0, cloudinary_utils_1.upload)(file.path, dir);
        category.image = {
            path,
            public_id,
        };
    }
    ;
    category.save();
    res.status(201).json({
        message: "category created",
        data: category,
        status: "success",
    });
});
// delete
exports.delete_category = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const category = await category_model_1.default.findById({ _id: id });
    if (!category) {
        throw new error_handler_middleware_1.default("Category not found", 404);
    }
    if (category.image) {
        await (0, cloudinary_utils_1.deletefile)(category.image.public_id);
    }
    await category.deleteOne();
    res.status(201).json({
        message: "category deleted",
        data: category,
        status: "success",
    });
});
