"use strict";
//user
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// items -> [{product ->, quantity}]
// total amount
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const enum_types_1 = require("../@types/enum.types");
const wishlist_controller_1 = require("../controllers/wishlist.controller");
const router = express_1.default.Router();
router.post('/', (0, auth_middleware_1.authenticate)([enum_types_1.Role.USER]), wishlist_controller_1.create);
router.get('/', (0, auth_middleware_1.authenticate)([enum_types_1.Role.USER]), wishlist_controller_1.getAll);
router.delete('/', (0, auth_middleware_1.authenticate)([enum_types_1.Role.USER]), wishlist_controller_1.clearAll);
exports.default = router;
