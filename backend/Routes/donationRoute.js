import express from 'express';
import { createDonation,getMyDonations } from '../Controller/donationController.js';
import { verifyToken } from '../Middleware/authmiddleware.js';

const router = express.Router();
router.post('/', verifyToken, createDonation);
router.get('/my', verifyToken, getMyDonations);

export { router as donationRouter };