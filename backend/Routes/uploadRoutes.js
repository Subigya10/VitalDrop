import express from 'express';
import upload from "../Middleware/multerconfig.js";
import { uploadFile } from '../Controller/fileController.js';

const router = express.Router();
router.post('/upload', upload.single('file'), uploadFile);
export default router;