"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const enum_types_1 = require("../@types/enum.types");
const cart_controller_1 = require("../controllers/cart.controller");
const router = express_1.default.Router();
router.post('/', (0, auth_middleware_1.authenticate)([enum_types_1.Role.USER]), cart_controller_1.create);
router.get('/', (0, auth_middleware_1.authenticate)([enum_types_1.Role.USER]), cart_controller_1.getCart);
router.delete('/clearAll', (0, auth_middleware_1.authenticate)([enum_types_1.Role.USER]), cart_controller_1.clearAll);
router.delete('/:id', (0, auth_middleware_1.authenticate)([enum_types_1.Role.USER]), cart_controller_1.remove);
exports.default = router;
