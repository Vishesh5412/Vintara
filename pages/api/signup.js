import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import * as cookie from "cookie";

import userModel from "../../models/UserModel";
import connectToDatabase from "../../config/mongoose";
import jwt from "jsonwebtoken";

//use camel case for nextAPIs
//both login and sign are authentication
if (!global.firebaseAdminApp) {
  global.firebaseAdminApp = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

const auth = getAuth();

export default async function signupUser(req, res) {
  if (req.method === "POST") {
    try {
      await connectToDatabase();
      const { name, email } = req.body;
      if (!name || !email) {
        return res.status(400).json({ message: "All field are required" });
      }
      const registerUser = await userModel.findOne({ email });
      if (registerUser) {
        console.log("User already exists");
        return res.status(409).json({ message: "User already exists" });
      }

      const newUser = await userModel.create({
        name,
        email,
      });
      const user = newUser.toObject();
      user._id = user._id.toString();
      const token = jwt.sign(
        { userid: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
          algorithm: "HS256", // Explicit algorithm
        }
      );
      let serialized;
      try {
        serialized = cookie.serialize("authToken", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60, // 1 hour in seconds
          path: "/",
        });
      } catch (error) {
        console.error("Cookie serialization error:", error);
        throw error; // or handle accordingly
      }

      res.setHeader("Set-Cookie", serialized);

      console.log("User registration successful");
      res.status(201).json({ message: "Success", token });
    } catch (err) {
      console.log("User authentication failed", err);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
