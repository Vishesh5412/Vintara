import ProductModel from "../../models/ProductModel";
import connectToDatabase from "../../config/mongoose";
//use camelCase for nextAPis
export default async function GetProducts(req, res) {
  if (req.method == "GET") {
    try {
      await connectToDatabase();
      const Products = await ProductModel.find();
      res.status(200).json({ message: "Product fetch successfully", Products });
    } catch (err) {
      console.log("Unable to fetch products", err);
      res.status(500).json({ message: "Unable to fetch products" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
