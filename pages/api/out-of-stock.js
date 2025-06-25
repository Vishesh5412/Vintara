import ProductModel from "../../models/ProductModel";
import connectToDatabase from "../../config/mongoose";
import getProductByCateory from "./getByCategory";

export default async function (req, res) {
  await connectToDatabase();
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  try {
    let { id } = req.body;
    let product = await ProductModel.findById(id);
    if (!product) {
      return res.status(400).json({ message: "Something went wrong" });
    }
    product.isOutOfStock = !product.isOutOfStock;
    await product.save();
    return res.status(200).json({ message: "success" });
  } catch (err) {
    console.log("Unable to delete product", err);
    res.status(500).json({ message: "Something went wrong" });
  }
}
