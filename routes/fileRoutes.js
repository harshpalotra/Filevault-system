import express from 'express';
import authmiddleware from '../middlewares/authmiddleware.js';
import { uploadFileController, downloadFileController } from '../controllers/filecontroller.js';


const router = express.Router();


router.post('/upload', authmiddleware, uploadFileController);
router.get('/:id/download', authmiddleware, downloadFileController);

export default router;