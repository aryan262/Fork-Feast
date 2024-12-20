import express from 'express'
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';
import { addMenu, editMenu } from '../controllers/menu.controller.js';
const router = express.Router();
router.route('/').post(isAuthenticated, upload.single("image"), addMenu)
router.route('/:id').put(isAuthenticated, upload.single("image"), editMenu)
export default router