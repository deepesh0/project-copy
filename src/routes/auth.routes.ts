import express from "express";

import { login, register } from "../controllers/auth.controller";
import { uploadFile } from "../middlewares/multer.middleware";
import { authenticate } from '../middlewares/auth.middleware';
import { Role } from "../@types/enum.types";


const router = express.Router();
const upload = uploadFile()

router.post("/register", upload.single("profile_image"), register);
router.post("/login", login);
router.get("/me", authenticate([Role.ADMIN, Role.USER]));

export default router;
