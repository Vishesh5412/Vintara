import React from "react";
import styles from "./featureProduct.module.css";
import Link from "next/link";
import Image from "next/image";

const FeatureProduct = ({ featureItems }) => {
  if (!featureItems) return;
  return (
    <section className={styles["products"]}>
      <div className={styles["products-container"]}>
        <h2 className={styles["section-title"]}>FEATURED PRODUCTS</h2>

        {featureItems.map((items, i) => (
          <React.Fragment key={items.category || i}>
            <p className={styles.headLn}>{items.category}</p>
            <div className={styles["product-grid"]} key={i}>
              {items.products.map((item) => (
                <div key={item._id} className={styles.imageContainer}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    className={styles.WearItemImage}
                    loading="lazy"
                    width={300}
                    height={300}
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>
            <Link href={`/${items.category}?sort=newest`}>
              {" "}
              <button className={styles.vis}>View all</button>{" "}
            </Link>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default FeatureProduct;
