import ProductModel from "../../models/ProductModel";
import connectToDatabase from "../../config/mongoose";

export default async function getCartInfo(req, res) {
  if (req.method === "POST") {
    await connectToDatabase();
    try {
      const cartItems = req.body;
      const mergedData = [];
      for (const item of cartItems) {
        let product = await ProductModel.findOne({
          _id: item.productId,
        }).lean();
        if (product) {
          let calDiscount = Math.floor(
            (1 - product.price / product.originalPrice) * 100
          );
          let calSaving = Math.floor(product.originalPrice - product.price);
          mergedData.push({
            ...product,
            size: item.size,
            color: item.color,
            calDiscount: calDiscount,
            calSaving: calSaving,
            quantity: item.quantity,
            cartEntryId: item.cartEntryId,
          });
        }
      }
      res.status(200).json({ message: "success", mergedData });
    } catch (err) {
      console.log("Unable to fetch CartInfo", err);
      res.status(404).json({ message: "Cart info fetching Unsuccessful" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
