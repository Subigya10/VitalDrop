import express from "express";
import { 
  createBloodRequest, 
  getActiveRequests, 
  acceptRequest,
  getMyRequests,
  getDonationCount,
  getAllRequests,
  updateRequestStatus
} from "../Controller/requestController.js";
import { verifyToken } from "../Middleware/authmiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getAllRequests);          // Admin: all requests
router.get("/all", getActiveRequests);                 // Public: pending only
router.get("/my", verifyToken, getMyRequests);
router.get("/donations/count", verifyToken, getDonationCount);
router.post("/", verifyToken, createBloodRequest);
router.patch("/accept/:id", verifyToken, acceptRequest);
router.patch("/:id", verifyToken, updateRequestStatus); // Admin: update status

export { router as requestRouter };