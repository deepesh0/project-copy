"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const multer_middleware_1 = require("../middlewares/multer.middleware");
const router = express_1.default.Router();
const upload = (0, multer_middleware_1.uploadFile)();
router.post("/register", upload.single("profile_image"), auth_controller_1.register);
router.post("/login", auth_controller_1.login);
exports.default = router;
