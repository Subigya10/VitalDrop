import express from 'express';
import { createDonation, getMyDonations, getLeaderboard } from '../Controller/donationController.js';
import { verifyToken } from '../Middleware/authmiddleware.js';

const router = express.Router();

router.post('/', verifyToken, createDonation);
router.get('/my', verifyToken, getMyDonations);
router.get('/leaderboard', verifyToken, getLeaderboard);

export { router as donationRouter };