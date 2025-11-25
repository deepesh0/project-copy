//user

// items -> [{product ->, quantity}]

// total amount

import express from 'express'
import { authenticate } from '../middlewares/auth.middleware';
import { Role } from '../@types/enum.types';

import {create ,getAll, clearAll} from '../controllers/wishlist.controller'

const router = express.Router()

router.post('/', authenticate([Role.USER]),create)
router.get('/', authenticate([Role.USER]),getAll)
router.delete('/', authenticate([Role.USER]),clearAll)
export default router