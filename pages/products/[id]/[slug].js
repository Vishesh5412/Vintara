import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import connectToDatabase from "../../../config/mongoose";
import Link from "next/link";
import mongoose from "mongoose";

import ProductModel from "../../../models/ProductModel";

import Navbar from "../../../components/Navbar";
import styles from "../../../styles/preview.module.css";

import { useRouter } from "next/router";
import Router from "next/router";
import { useCart } from "../../../context/cart/cartContext";
import { useAuth } from "../../../context/user/userContext";
import { useAlert } from "../../../context/alertContext";
import { notFound } from "next/navigation";

export async function getServerSideProps(context) {
  const fakeStars = 4 + "." + Math.floor(Math.random() * 10);
  const fakeReview = 50 + Math.floor(Math.random() * 40);
  const { id, slug } = context.params; //here inside getServerSideProps router.query can't be used
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return {
      notFound: true, // or redirect to error page
    };
  }

  await connectToDatabase();
  const product = await ProductModel.findOne({ _id: id, slug }).lean();
  if (!product) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      fakeReview,
      fakeStars,
    },
  };
}

export default function Page(props) {
  const router = useRouter();
  const { userLog } = useAuth();
  const { showToast } = useAlert();
  const { updateCart } = useCart();

  const [selectedColor, setSelectedColor] = useState("black");
  const [selectedSize, setSelectedSize] = useState("M");

  const colors = [
    { name: "black", value: "#000000" },
    { name: "white", value: "#ffffff" },
    { name: "navy", value: "#1e3a8a" },
    { name: "grey", value: "#808080" },
  ];

  const handleAddToCart = async (id) => {
    if (props.product.isOutOfStock) {
      return showToast("error", "Sorry the product is currently out of stock");
    }
    const cartProduct = {
      productId: id,
      color: selectedColor,
      size: selectedSize,
      cartEntryId: uuidv4(),
      quantity: 1,
    };
    let cartArr = localStorage.getItem("cartArr"); //always return string
    if (!cartArr) {
      cartArr = [];
    } else {
      cartArr = JSON.parse(cartArr); //parse method not work with empty array
    }
    cartArr.push(cartProduct);
    localStorage.setItem("cartArr", JSON.stringify(cartArr)); //JSON.stringify convert a object to a  string

    if (userLog != null) {
      let response = await fetch("/api/update-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userLog._id,
          userCart: cartArr,
        }),
      });
      if (response.ok) {
        updateCart();
        return showToast("success", "Product added to cart");
      }
      return showToast("error", "Something went wrong");
    }
    updateCart();
    return showToast("success", "Product added to cart");
    //opposite of it is JSON.parse which convert a string back to object(**type of array is also object**)
  };

  const handleBuyNow = (id) => {
    if (props.product.isOutOfStock) {
      return showToast("error", "Sorry the product is currently out of stock");
    }
    handleAddToCart(id);
    Router.push('/cart');
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.imageSection}>
          <div className={styles.productImage}>
            <img
              src={props.product.image}
              alt="Product Image"
              className={styles.image}
            />
          </div>
        </div>

        <div className={styles.detailsSection}>
          <div className={styles.rating}>
            <div className={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={
                    i < Math.floor(props.fakeStars)
                      ? styles.starFilled
                      : styles.starEmpty
                  }
                >
                  ★
                </span>
              ))}
            </div>
            <span className={styles.ratingText}>
              {props.fakeStars} ({props.fakeReview} reviews)
            </span>
          </div>

          <h1 className={styles.productTitle}>{props.product.name}</h1>
          <p className={styles.productDesc}>{props.product.desc}</p>
          <div className={styles.colorSection}>
            <h3 className={styles.sectionTitle}>Color</h3>
            <div className={styles.colorOptions}>
              {colors.map((color) => (
                <button
                  key={color.name}
                  className={`${styles.colorOption} ${
                    selectedColor === color.name ? styles.colorSelected : ""
                  }`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setSelectedColor(color.name)}
                  aria-label={color.name}
                >
                  {selectedColor === color.name && (
                    <span className={styles.checkmark}>✓</span>
                  )}
                </button>
              ))}
            </div>
            <span className={styles.selectedOption}>
              Selected:{" "}
              {selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)}
            </span>
          </div>

          <div className={styles.sizeSection}>
            <h3 className={styles.sectionTitle}>Size</h3>
            <div className={styles.sizeOptions}>
              {props.product.sizes.map((size) => (
                <button
                  key={size}
                  className={`${styles.sizeOption} ${
                    selectedSize === size ? styles.sizeSelected : ""
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.priceSection}>
            <span className={styles.price}>₹{props.product.price}/-</span>{" "}
            &nbsp;
            <span style={{ color: "red" }}>
              {props.product.isOutOfStock ? "[ Out Of Stock !! ]" : ""}
            </span>
          </div>

          <div className={styles.buttonGroup}>
            <button
              className={styles.addToCartBtn}
              onClick={() => handleAddToCart(`${props.product._id}`)}
            >
              Add to Cart
            </button>

            <button
              className={styles.buyNowBtn}
              onClick={()=>handleBuyNow(props.product._id)}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
