"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_middleware_1 = require("../middlewares/multer.middleware");
const brand_controller_1 = require("../controllers/brand.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const enum_types_1 = require("../@types/enum.types");
// import Brand from '../models/brand.model';
const router = express_1.default.Router();
const upload = (0, multer_middleware_1.uploadFile)();
// get all
router.get('/', brand_controller_1.getAll);
router.get('/:id', brand_controller_1.getById);
router.post('/', upload.single('image'), (0, auth_middleware_1.authenticate)([enum_types_1.Role.ADMIN]), brand_controller_1.create);
router.put('/:id', upload.single('image'), (0, auth_middleware_1.authenticate)([enum_types_1.Role.ADMIN]), brand_controller_1.update);
router.delete('/:id', (0, auth_middleware_1.authenticate)([enum_types_1.Role.ADMIN]), brand_controller_1.delete_brand);
exports.default = router;
