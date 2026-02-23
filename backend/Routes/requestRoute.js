import express from "express";
import { createBloodRequest, getActiveRequests } from "../Controller/requestController.js";

const router = express.Router();

// The "Post Request" URL
router.post("/", createBloodRequest);

// The "Get all requests" URL (for your dashboard table)
router.get("/all", getActiveRequests);

export { router as requestRouter };