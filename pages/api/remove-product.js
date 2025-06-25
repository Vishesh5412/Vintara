import ProductModel from "../../models/ProductModel";
import connectToDatabase from "../../config/mongoose";

export default async function (req, res) {
  await connectToDatabase();
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  try {
    let { id } = req.body;
    //actually the delete function return a object every time so i can't directly write !result
    let product = await ProductModel.deleteOne({ _id: id });
    if (product.deletedCount === 0) {
      return res
        .status(400)
        .json({ message: "Deletion failed: Product not found" });
    }
    return res.status(200).json({ message: "success" });
  } catch (err) {
    console.log("Unable to delete product", err);
    res.status(500).json({ message: "Something went wrong" });
  }
}
