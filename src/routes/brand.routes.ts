import express  from 'express';
import { uploadFile } from '../middlewares/multer.middleware';
import { getAll, getById,create, delete_brand, update } from '../controllers/brand.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { Role } from '../@types/enum.types';
// import Brand from '../models/brand.model';

const router = express.Router();
const upload = uploadFile()

// get all
router.get('/', getAll);
router.get('/:id', getById)
router.post('/',upload.single('image'),authenticate([Role.ADMIN]),create)
router.put('/:id', upload.single('image'),authenticate([Role.ADMIN]),update)
router.delete('/:id',authenticate([Role.ADMIN]),delete_brand)
export default router;