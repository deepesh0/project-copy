import express from 'express'
import { authenticate } from '../middlewares/auth.middleware';
import { Role } from '../@types/enum.types';
import { getCart, create, remove, clearAll } from '../controllers/cart.controller';



const router = express.Router()

router.post('/', authenticate([Role.USER]),create)
router.get('/', authenticate([Role.USER]),getCart)
router.delete('/clearAll', authenticate([Role.USER]), clearAll)
router.delete('/:id', authenticate([Role.USER]), remove)

export default router