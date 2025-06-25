import mongoose from "mongoose";
const OrderSchema = new mongoose.Schema(
  {
    product: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return v === "" || /^[6-9]\d{9}$/.test(v); // 10 digits starting with 6-9
        },
      },
    },
    address: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pin: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return v === "" || /^\d{6}$/.test(v);
        },
      },
    },
    total: {
      type: Number,
      required: true,
    },
    isOrdered: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const OrderModel =
  mongoose.models.order || mongoose.model("order", OrderSchema);
export default OrderModel;
