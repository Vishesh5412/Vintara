import { getAuth } from "firebase-admin/auth";
import UserModel from "../../models/UserModel";
import { firebaseAdmin } from "../../lib/firebaseClient"; // your Firebase Admin init
import * as cookie from 'cookie';
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const authHeader = req.headers.authorization || "";
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
          .status(401)
          .json({ message: "Unauthorized: No valid auth header" });
      }
      const idToken = authHeader.split("Bearer ")[1];
      if (!idToken) return res.status(401).json({ message: "Unauthorized" });

      await getAuth(firebaseAdmin).verifyIdToken(idToken);
      // to check firebase id so that no one can login only via backedn

      const { email } = req.body;
      let user = await UserModel.findOne({ email });
      if (!user) {
        console.log("User not found");
        return res.status(401).json({ message: "User not found" });
      }

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
      res.status(200).json({ message: "Success", token });
    } catch (err) {
      console.log("User authentication failed");
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
