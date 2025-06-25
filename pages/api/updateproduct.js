import ProductModel from "@/models/ProductModel";
import connectToDatabase from "../../config/mongoose";

export default async function UpdateProduct(req, res) {
  if (req.method == "PUT") {
    try {
      await connectToDatabase();
      console.log("connected");

      const { image, category, name,slug, desc, price, discount, sizes } = req.body;
      const Product = await ProductModel.findByIdAndUpdate(
        req.body._id,
        {
          image,
          category,
          name,
          slug,
          desc,
          price,
          discount,
          sizes,
        },
        { new: true } // This will return the updated document
      );
      res.status(200).json({ message: "success", Product });
    } catch (err) {
      console.log("Product updation failed");
      res.status(500).json({ message: "Product updation failed" });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
