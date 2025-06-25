import mongoose from "mongoose";
const ProductSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
    },
    originalPrice: {
      type: Number,
      required: true,
    },
    sizes: [
      {
        type: String,
        required: true,
      },
    ],
    isOutOfStock: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const ProductModel =
  mongoose.models.product || mongoose.model("product", ProductSchema);
export default ProductModel;
