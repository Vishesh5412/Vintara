import UserModel from "../../models/UserModel";
import connectToDatabase from "../../config/mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

export default async function (req, res) {
  await connectToDatabase();
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  try {
    const { token, password } = req.body;
    let hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    let user = await UserModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    }); //gt means greater than
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    user.password = hash;
    await user.save({ validateBeforeSave: false });
    const jwtToken = jwt.sign({ userid: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
      algorithm: "HS256", // Explicit algorithm
    });
    return res.status(200).json({ message: "success", jwtToken });
  } catch (err) {
    console.log(" Reset password failed", err);
    res.status(500).json({ message: "Some internal error occured" });
  }
}
