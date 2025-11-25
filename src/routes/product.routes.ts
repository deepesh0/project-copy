import express from 'express'
import { uploadFile } from '../middlewares/multer.middleware';
import { getAll, getByID, create, update, getProductByCategory, getProductByFeature, getProductByArrival } from '../controllers/product.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { Role } from '../@types/enum.types';

const router = express.Router()
const upload = uploadFile()

router.get('/', getAll)

router.post('/', upload.fields([
    {    name:'cover_image',
    maxCount:1
},
{
    name:'images',
    maxCount:4
}]),authenticate([Role.ADMIN]), create)


router.put('/:id', upload.fields([
    {    name:'cover_image',
    maxCount:1
},
{
    name:'images',
    maxCount:4
}]),authenticate([Role.ADMIN]),update)

router.get('/category/:category_id', getProductByCategory)
router.get('/featured', getProductByFeature)
router.get('/arrival', getProductByArrival)

router.get('/:id', getByID)
export default router