import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import BackToTopButton from "../../components/BackToTopButton";
import ProductModel from "../../models/ProductModel";
import UserModel from "../../models/UserModel";
import connectToDatabase from "../../config/mongoose";
import styles from "../../components/featureProduct.module.css";
import { useAlert } from "../../context/alertContext";
import Link from "next/link";
import Router from "next/router";
import { Fragment } from "react";
import { notFound } from "next/navigation";
//to import out of stock elements from database
export async function getServerSideProps({ req, res }) {
  await connectToDatabase();

  let products = [];
  let user;
  try {
    user = await UserModel.findOne({ isAdmin: true }).lean();
    products = await ProductModel.find({ isOutOfStock: true }).lean();
  } catch (err) {
    console.error("Unable to fetch products:", err);
    // You could also return a fallback or redirect here
  }
  if (!user) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      products: JSON.parse(JSON.stringify(products)), // Necessary if using MongoDB documents
    },
  };
}

const OutStock = ({ products , user}) => {
  const [hoveredItemId, setHoveredItemId] = useState("");
  const { showToast } = useAlert();

  const handleRemove = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmed) return;

    const response = await fetch("/api/out-of-stock", {
      method: "POST",
      headers: {
        //this line tells the server that client is sending data in form of json
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) {
      return showToast("error", "Deletion failed, Try again");
    }
    Router.push("/admin/out-of-stock");
    return showToast("success", "Product updated successfully");
  };

  const handleOutOfStock = async (id) => {
    const confirmed = window.confirm("Are you sure ?");
    if (!confirmed) return;

    const response = await fetch("/api/out-of-stock", {
      method: "POST",
      headers: {
        //this line tells the server that client is sending data in form of json
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) {
      return showToast("error", "Deletion failed, Try again");
    }
    Router.push("/admin/out-of-stock");
    return showToast("success", "Product updated successfully");
  };

  return (
    <>
      <Navbar />
      <section className={styles["products"]}>
        <div className={styles["products-container"]}>
          <br />
          <br />
          <h2 className={styles["section-title"]}>OUT OF STOCK !!</h2>
          {/* to set the logic when product array in empty */}
          {!products.length && (
            <div>Currently there are 0 Out-of-Stock items.</div>
          )}

          <Fragment>
            <div className={styles["product-grid"]}>
              {products.map((product) => (
                <div className={styles["productcard"]} key={product._id}>
                  <div
                    className={styles.imageContainer}
                    onMouseEnter={() => setHoveredItemId(product._id)}
                    onMouseLeave={() => setHoveredItemId(null)}
                  >
                    <Link href={`/products/${product._id}/${product.slug}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className={styles.WearItemImage}
                      />
                    </Link>
                    {hoveredItemId === product._id && (
                      <button
                        className={styles.absBtn}
                        onClick={() => handleOutOfStock(product._id)}
                      >
                        {product.isOutOfStock ? "Unset" : "Set"} Out-of-stock
                      </button>
                    )}
                  </div>
                  <button
                    className={`${styles.vis} ${styles.rmvBtn}`}
                    onClick={() => handleRemove(product._id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
              <br />
              <br />
            </div>
            <Link href={"/admin/fetch-all"}>
              <button className={`${styles.vis}`}>View all items</button>
            </Link>
          </Fragment>
        </div>
      </section>
        <BackToTopButton/>
    </>
  );
};

export default OutStock;
