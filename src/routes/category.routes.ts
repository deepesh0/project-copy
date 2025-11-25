
import express  from 'express';
import { create, getAll, getById, update, delete_category } from '../controllers/category.controller';
import { uploadFile } from '../middlewares/multer.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { Role } from '../@types/enum.types';




const router = express.Router();
const upload = uploadFile()

// get all
router.get('/', getAll);
router.get('/:id',getById)
router.post('/',upload.single('image'),authenticate([Role.ADMIN]),create)
router.put('/:id', upload.single('image'),authenticate([Role.ADMIN]),update)
router.delete('/:id',authenticate([Role.ADMIN]),delete_category)
export default router;