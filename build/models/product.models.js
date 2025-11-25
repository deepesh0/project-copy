"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.ProductSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        unique: [true, "Unique name required"],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
    },
    stock: {
        type: Number,
        required: [true, "Price is required"],
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        minLength: 25,
        trim: true,
    },
    cover_image: {
        required: [true, "Description is required"],
        type: {
            path: {
                type: String,
                required: [true, "Path is required"],
            },
            public_id: {
                type: String,
                required: [true, "Public Id is required"],
            },
        },
    },
    images: [
        {
            path: String,
            public_id: String,
        },
    ],
    is_featured: {
        type: Boolean,
        default: false,
    },
    new_arrival: {
        type: Boolean,
        default: false,
    },
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "category",
        required: [true, "Category is required"],
    },
    brand: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "brand",
        required: [true, "Brand is required"],
    },
}, { timestamps: true });
const Product = mongoose_1.default.model("product", exports.ProductSchema);
exports.default = Product;
