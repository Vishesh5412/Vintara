import jwt from "jsonwebtoken";
import UserModel from "../../models/UserModel";
import connectToDatabase from "../../config/mongoose";

export default async function verifyUser(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  await connectToDatabase();

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"], // Must match signing algorithm
      ignoreExpiration: false, // Change to true for debugging
    });

    // Find user
    const existingUser = await UserModel.findById(decoded.userid).select(
      "-password"
    );
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ existingUser });
  } catch (err) {
    console.error("Verification error:", err);

    // Handle specific JWT errors
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token expired" });
    }

    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
}
