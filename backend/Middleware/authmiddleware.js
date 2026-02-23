// Middleware/authMiddleware.js
import jwt from "jsonwebtoken";

/**
 * Middleware to verify the JWT token and attach user data to the request.
 * Essential for VitalDrop to track requesterId and donorId.
 */
export const verifyToken = (req, res, next) => {
  // 1. Get the token from the Authorization header
  const authHeader = req.headers.authorization;
  
  // 2. Check if the header exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send({ message: "No token provided. Please login again." });
  }

  // 3. Extract the token (removing the "Bearer " prefix)
  const token = authHeader.split(" ")[1];

  try {
    // 4. Verify the token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /**
     * IMPORTANT: Since your generateToken signs the payload directly:
     * jwt.sign(payload, ...) -> decoded IS the payload.
     * We attach it directly to req.user.
     */
    req.user = decoded; 

    // 5. Proceed to the controller (e.g., createBloodRequest or acceptRequest)
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    return res.status(401).send({ message: "Invalid or expired token" });
  }
};