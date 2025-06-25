import UserModel from "../../models/UserModel";
import connectToDatabase from "../../config/mongoose";
import crypto from "crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function (req, res) {
  await connectToDatabase();
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .json({ message: "If the email exists, a reset link has been sent." });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");
    //we are storing hashed one instead of raw one because of security purpose
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false }); //used when we ddin't want to change already filled(required) states

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${rawToken}`;

    const data = await resend.emails.send({
      from: "Your App <onboarding@resend.dev>", // Resend verified sender
      to: email,
      subject: "Reset your password",
      html: ` 
       <p>Hi ${user.name},</p>
        <p>We received a request to reset your password. Click the link below to reset it:</p>
        <p>🔗 <a href="${resetUrl}">Reset Password</a></p>
        <p>This link will expire in 10 minutes. If you didn’t request this, you can safely ignore this email.</p>
        <p>Thanks,<br/>Vintara</p>
     `,
    });

    res
      .status(200)
      .json({ message: "If the email exists, a reset link has been sent." });
  } catch (err) {
    console.log("Unable to reset password", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
