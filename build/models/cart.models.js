"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
//user, product -->id
const cartSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'User is required']
    },
    items: [
        {
            product: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'prodct',
                required: [true, 'User is required']
            },
            quantity: {
                type: Number
            }
        }
    ]
}, { timestamps: true });
const cart = mongoose_1.default.model('cart', cartSchema);
exports.default = cart;
