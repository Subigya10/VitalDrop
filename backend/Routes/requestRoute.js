import express from "express";
import { 
  createBloodRequest, 
  getActiveRequests, 
  acceptRequest ,
    getMyRequests ,
    getDonationCount
} from "../Controller/requestController.js";
import { verifyToken } from "../Middleware/authmiddleware.js"; // Import it!


const router = express.Router();

// PROTECT THESE ROUTES
// This ensures req.user.id is available in your controllers
router.post("/", verifyToken, createBloodRequest); 
router.patch("/accept/:id", verifyToken, acceptRequest);

// KEEP THIS PUBLIC (so anyone can see the need for blood)
router.get("/all", getActiveRequests);
router.get("/my", verifyToken, getMyRequests);  // ← ADD
router.get("/donations/count", verifyToken, getDonationCount);

export { router as requestRouter };