import Router from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import BackToTopButton from "../components/BackToTopButton";
import Link from "next/link";
import connectToDatabase from "../config/mongoose";
import styles from "../styles/wearitem.module.css";
import ProductModel from "../models/ProductModel";
import { notFound } from "next/navigation";
import Image from "next/image";

export async function getServerSideProps(context) {
  //getServerSideProps can't access req.query.slug
  // getServerSideProps always return an object
  const { item: searchItem } = context.params;
  const { sort } = context.query;
  let SlugArr = ["Shirts", "Hoodies", "Shorts", "Pants"];
  if (SlugArr.includes(searchItem)) {
    await connectToDatabase();
    let wearItems = await ProductModel.find({
      category: `${searchItem}`,
    }).lean();
    if (sort === "priceLowHigh") {
      wearItems = wearItems.sort((a, b) => a.price - b.price); //it means compare the price of a with that of b if < 0 means a b     if  > 0 means b comes before a     if 0 then remain intact
    } else if (sort === "priceHighLow") {
      wearItems = wearItems.sort((a, b) => b.price - a.price);
    } else if (sort === "newest") {
      wearItems = wearItems.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (sort === "discount") {
      wearItems = wearItems.sort((a, b) => b.discount - a.discount);
    } else {
      return { notFound: true };
    }
    return {
      props: { wearItems: JSON.parse(JSON.stringify(wearItems)) },
    };
  }
  return {
    notFound: true,
  };
}

export default function Page({ wearItems }) {
  const [sorting, setSorting] = useState("newest");

  const [isSortDivVisible, setIsSortDivVisible] = useState(false);

  useEffect(() => {
    if (!sorting) return;

    Router.push(
      {
        pathname: Router.pathname,
        query: {
          ...Router.query, //jo presently query hai wo present rhe
          sort: sorting,
        },
      },
      undefined,
      { scroll: false } // Optional: Prevent scroll to top
    );
  }, [sorting]);

  function handleSorting(e) {
    setSorting(e.target.dataset.value);
    setIsSortDivVisible(!isSortDivVisible);
  }
  return (
    <>
      <Navbar />
      <div className={styles.WearItemContianer}>
        <div className={styles.WearItemHeader}>
          Sort by: &nbsp;&nbsp;{" "}
          <span
            className={styles.srtType}
            onClick={() => setIsSortDivVisible(!isSortDivVisible)}
          >
            {sorting}{" "}
          </span>
          {isSortDivVisible && (
            <div className={styles.srtDv}>
              <ul onClick={(e) => handleSorting(e)}>
                <li data-value="newest">Newest </li>
                <li data-value="discount">Discount</li>
                <li data-value="priceLowHigh">Price: Low to High</li>
                <li data-value="priceHighLow">Price: High to Low</li>
              </ul>
            </div>
          )}
        </div>

        <div className={styles.WearItemGrid}>
          {wearItems.map((wearItem) => (
            <div key={wearItem._id} className={styles.WearItemCard}>
              <div className={styles.imageContainer}>
                <Image
                  src={wearItem.image}
                  alt={wearItem.name}
                  className={styles.WearItemImage}
                  width={300}
                  height={300}
                  style={{ width: "auto" }}
                />
              </div>

              <div className={styles.cardContent}>
                <h3 className={styles.WearItemName}>{wearItem.name}</h3>

                <div className={styles.priceSection}>
                  <span className={styles.currentPrice}>₹{wearItem.price}</span>
                  {wearItem.originalPrice && (
                    <span className={styles.originalPrice}>
                      ₹{wearItem.originalPrice}
                    </span>
                  )}
                  <span className={styles.disPCe}>
                    ({wearItem.discount}%OFF)
                  </span>
                </div>

                <Link href={`/products/${wearItem._id}/${wearItem.slug}`}>
                  <button className={styles.addToPreview}>Preview</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BackToTopButton />
    </>
  );
}
