import UserModel from "../../models/UserModel";
import connectToDatabase from "../../config/mongoose";

export default async function (req, res) {
  await connectToDatabase();
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  try {
    const {formData} = req.body;
    let { id, name, phone, address, pin, state } = formData;
    if (!id) {
      res.status(400).json({ message: "Id is required" });
    }

    phone = /^[6-9]\d{9}$/.test(phone) ? phone : "";
    pin = /^\d{6}$/.test(pin) ? pin : "";
    const isUserExist = await UserModel.findById(id);
    if (!isUserExist) {
      return res.status(400).json({ message: "Authentication failed" });
    }
    let user = await UserModel.findByIdAndUpdate(
      id,
      {
        name,
        phone,
        address,
        state,
        pin,
      },
      { new: true, runValidators: true }
    );
    return res.status(200).json({ message: "success", user });
  } catch (err) {
    console.log("Something went wrong");
    res.status(500).json({ message: "Something went wrong" });
  }
}
