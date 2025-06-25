import ProductModel from "../../models/ProductModel";
import connectToDatabase from "../../config/mongoose";
export default async function AddProduct(req, res) {
  if (req.method === "POST") {
    try {
      await connectToDatabase();
      const { updatedData } = req.body;
      const { image, category, name, slug, desc, price, originalPrice, sizes } =
        updatedData;
      if (!image ||  !category || !name || !slug || !desc || !price || !originalPrice || !sizes){
        return res.status(400).json({message: 'All fields are required'});
      }
      let calDiscount = Math.floor((1 - price / originalPrice) * 100);
      if (!Array.isArray(sizes) || sizes.length === 0) {
        return res
          .status(400)
          .json({ message: "Sizes is required and must be a non-empty array" });
      }
      let ExistingProduct = await ProductModel.findOne({ image });
      if (ExistingProduct) {
        return res.status(400).json({ message: "Product already exists" });
      }
      let NewProduct = await ProductModel.create({
        image,
        category,
        name,
        slug,
        desc,
        price,
        originalPrice,
        sizes,
        discount: calDiscount,
      });
      return res.status(200).json({
        message: "Product added successfully",
        product: NewProduct,
      });
    } catch (err) {
      console.error("Unable to add product", err.message);
      res.status(500).json({ message: "Unable to add product" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
