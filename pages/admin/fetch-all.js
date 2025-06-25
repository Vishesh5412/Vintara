import React, { useState } from "react";
import BackToTopButton from "../../components/BackToTopButton";
import ProductModel from "../../models/ProductModel";
import connectToDatabase from "../../config/mongoose";
import styles from "../../components/featureProduct.module.css";
import { Fragment } from "react";
import Router from "next/router";
import Link from "next/link";
import Image from "next/image";

import { useAlert } from "../../context/alertContext";
import UserModel from "@/models/UserModel";
import { notFound } from "next/navigation";


//to import out of stock elements from database
export async function getServerSideProps({ req, res }) {
  await connectToDatabase();
  let user = await UserModel.findOne({ isAdmin: true }).lean();
  let totalProducts = 0;
  let featureProducts = ["Shirts", "Hoodies", "Pants", "Shorts"];
  let featureItems = [];
  for (const item of featureProducts) {
    let products = await ProductModel.find({ category: item }).lean(); //lean used to return javascript objects
    // ie. in order to decreat the size of large mongoose object
    // without using lean can be benificial probably when we are interested in .save() or update() method
    totalProducts += products.length;
    featureItems.push({ category: item, products });
  }
  if (!user) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      featureItems: JSON.parse(JSON.stringify(featureItems)),
      totalProducts,
    },
  };
}

const FetchAll = ({ featureItems, totalProducts }) => {
  const [hoveredItemId, setHoveredItemId] = useState("");
  const { showToast } = useAlert();

  const [loading, setLoading] = useState(false);

  const handleRemove = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to  delete this product?"
    );
    if (!confirmed) return;

    const response = await fetch("/api/remove-product", {
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
    Router.push("/admin/fetch-all");
    return showToast("success", "Product deleted successfully");
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
    Router.push("/admin/fetch-all");
    return showToast("success", "Product updated successfully");
  };

  return (
    <>
      <section className={styles["products"]}>
        <div style={{ textAlign: "center" }} className={styles.centx}>
          <p>Total: {totalProducts}</p>
        </div>
        <div className={styles["products-container"]}>
          {featureItems.map((items, i) => (
            <Fragment key={i}>
              <p className={styles.headLn}>
                {items.category}({items.products.length})
              </p>
              <div className={styles["product-grid"]}>
                {items.products.map((item) => (
                  <div className={styles["productcard"]} key={item._id}>
                    {/* { loading && */}
                    <div
                      className={styles.imageContainer}
                      onMouseEnter={() => setHoveredItemId(item._id)}
                      onMouseLeave={() => setHoveredItemId(null)}
                      // style={{backgroundColor="black"}}
                    >
                      <Link href={`/products/${item._id}/${item.slug}`}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          className={styles.WearItemImage}
                          loading="lazy"
                          fill
                          style={{ objectFit: "cover" }}
                          // onLoadingComplete={() => setLoading(false)}
                        />
                      </Link>
                      {hoveredItemId === item._id && (
                        <button
                          className={styles.absBtn}
                          onClick={() => handleOutOfStock(item._id)}
                        >
                          {item.isOutOfStock ? "Unset" : "Set"} Out-of-stock
                        </button>
                      )}
                    </div>
                {/* } */}
                    <button
                      className={`${styles.vis} ${styles.rmvBtn}`}
                      onClick={() => handleRemove(item._id)}
                    >
                      Delete
                    </button>
                  </div>
                // }
                
                ))}
              </div>
            </Fragment>
          ))}
          <br />
          <br />
          <Link href={"/admin/out-of-stock"}>
            {" "}
            <button className={`${styles.vis}`}>View out of stock</button>
          </Link>
        </div>
        <BackToTopButton/>
      </section>
    </>
  );
};

export default FetchAll;
