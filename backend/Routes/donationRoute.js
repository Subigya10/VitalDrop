import express from 'express';
import { createDonation, getMyDonations, getLeaderboard, getAllDonations, updateDonationStatus } from '../Controller/donationController.js';
import { verifyToken } from '../Middleware/authmiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getAllDonations);
router.post('/', verifyToken, createDonation);
router.get('/my', verifyToken, getMyDonations);
router.get('/leaderboard', verifyToken, getLeaderboard);
router.patch('/:id', verifyToken, updateDonationStatus);

export { router as donationRouter };