import jwt from "jsonwebtoken";

// This middleware checks if the user is logged in and attaches user info
export const verifyToken = (req, res, next) => {
  // Expect the token in Authorization header: "Bearer <TOKEN>"
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send({ message: "No token provided" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // use same secret as in generateToken
    req.user = decoded.user; // attach user info (id, role, etc.) to request
    next(); // go to the next middleware/controller
  } catch (err) {
    return res.status(401).send({ message: "Invalid token" });
  }
};
