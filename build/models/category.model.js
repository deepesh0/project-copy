"use strict";
// name , description , image
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// category schema
const categorySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        unique: [true, 'category already exists with given name'],
        trim: true,
    },
    description: {
        type: String,
        trim: true
    },
    image: {
        type: {
            path: String,
            public_id: String
        }
    }
}, {
    timestamps: true
});
const Category = mongoose_1.default.model('category', categorySchema);
exports.default = Category;
