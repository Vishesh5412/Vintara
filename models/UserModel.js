import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    cart: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        color: { type: String, required: true },
        size: { type: String, required: true },
        cartEntryId: { type: String, required: true },
        quantity: { type: Number, default: 1 },
      },
    ],
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    phone: {
      type: String,
      default: "",
      validate: {
        validator: function (v) {
          return v === "" || /^[6-9]\d{9}$/.test(v); // 10 digits starting with 6-9
        },
      },
    },
    address: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    pin: {
      type: String,
      default: "",
      validate: {
        validator: function (v) {
          return v === "" || /^\d{6}$/.test(v);
        },
      },
    },
  },
  { timestamps: true }
);
const UserModel = mongoose.models.user || mongoose.model("user", UserSchema);
export default UserModel;
