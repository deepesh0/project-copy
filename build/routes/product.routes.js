"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_middleware_1 = require("../middlewares/multer.middleware");
const product_controller_1 = require("../controllers/product.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const enum_types_1 = require("../@types/enum.types");
const router = express_1.default.Router();
const upload = (0, multer_middleware_1.uploadFile)();
router.get('/', product_controller_1.getAll);
router.post('/', upload.fields([
    { name: 'cover_image',
        maxCount: 1
    },
    {
        name: 'images',
        maxCount: 4
    }
]), (0, auth_middleware_1.authenticate)([enum_types_1.Role.ADMIN]), product_controller_1.create);
router.put('/:id', upload.fields([
    { name: 'cover_image',
        maxCount: 1
    },
    {
        name: 'images',
        maxCount: 4
    }
]), (0, auth_middleware_1.authenticate)([enum_types_1.Role.ADMIN]), product_controller_1.update);
router.get('/category/:category_id', product_controller_1.getProductByCategory);
router.get('/featured', product_controller_1.getProductByFeature);
router.get('/arrival', product_controller_1.getProductByArrival);
router.get('/:id', product_controller_1.getByID);
exports.default = router;
