import express from 'express';
import { createDonation } from '../Controller/donationController.js';
import { verifyToken } from '../Middleware/authmiddleware.js';

const router = express.Router();
router.post('/', verifyToken, createDonation);

export { router as donationRouter };