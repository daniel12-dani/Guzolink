import "../configs/env.config.js";
import jwt from "jsonwebtoken";

const SECRET = process.env.JW_SECRET || process.env.JWT_SECRET;

export default function GenerateToken(user) {
  if (!SECRET) {
    throw new Error("JWT secret is missing. Set JW_SECRET in your .env file.");
  }
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    SECRET,
    {
      expiresIn: "2h", // Token expires in 2 hours
    },
  );
}

export function VerifyToken(token) {
  if (!token) {
    console.log("No token is provided", token);
  }
  if (!SECRET) {
    throw new Error("JWT secret is missing. Set JW_SECRET in your .env file.");
  }
  // console.log("Token Provided, verifying...", token);
  // console.log("The Secret: ", SECRET);
  return jwt.verify(token, SECRET);
}

export function IsLoggedIn(req, res, next) {
  const authHeader = req.headers.authorization;

  // console.log("Auth Header: ", authHeader);
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "No Token Provided",
    });
  }

  const token = authHeader.split(" ")[1];
  // console.log("Auth Token: ", token);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Invalid Token Provided",
    });
  }
  try {
    const decoded_token = VerifyToken(token);
    // console.log("Decoded token: ", decoded_token);

    req.user = decoded_token;
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    console.log("Logged in verification failed: ", error);
    return res.status(401).json({
      success: false,
      message: "No Token Provided",
    });
  }
}
