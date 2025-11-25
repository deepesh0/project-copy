"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("../controllers/category.controller");
const multer_middleware_1 = require("../middlewares/multer.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const enum_types_1 = require("../@types/enum.types");
const router = express_1.default.Router();
const upload = (0, multer_middleware_1.uploadFile)();
// get all
router.get('/', category_controller_1.getAll);
router.get('/:id', category_controller_1.getById);
router.post('/', upload.single('image'), (0, auth_middleware_1.authenticate)([enum_types_1.Role.ADMIN]), category_controller_1.create);
router.put('/:id', upload.single('image'), (0, auth_middleware_1.authenticate)([enum_types_1.Role.ADMIN]), category_controller_1.update);
router.delete('/:id', (0, auth_middleware_1.authenticate)([enum_types_1.Role.ADMIN]), category_controller_1.delete_category);
exports.default = router;
