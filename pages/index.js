import Navbar from "../components/Navbar";
// import BackToTopButton from "../components/BackToTopButton";
import Chatbot from "../components/Chatbot";
import FeatureProduct from "../components/featureProduct";
import { useState, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/index.module.css";
import Link from "next/link";
import { FaRegAddressCard } from "react-icons/fa6";

import connectToDatabase from "../config/mongoose";
import ProductModel from "../models/ProductModel";

export async function getServerSideProps({ req, res }) {
  await connectToDatabase();
  let featureProducts = ["Shirts", "Hoodies", "Pants", "Shorts"];
  let featureItems = [];
  for (const item of featureProducts) {
    let products = await ProductModel.find({ category: item }).limit(4).lean(); //lean used to return javascript objects
    // ie. in order to decreat the size of large mongoose object
    // without using lean can be benificial probably when we are interested in .save() or update() method
    featureItems.push({ category: item, products });
  }
  return {
    props: { featureItems: JSON.parse(JSON.stringify(featureItems)) },
  };
}

export default function StyleHub({ featureItems }) {

  return (
    <div>
      <Navbar />
      {/* Hero Section */}
      <section className={styles.hero}>
        <div
          className={styles["hero-slider"]}
        >
          <div className={styles["hero-slide"]}>
            <div className={styles["hero-content"]}>
              <h1 className={styles.mlt12}>PREMIUM SHIRTS</h1>
              <p>
                Discover our collection of premium quality shirts for every
                occasion
              </p>
            </div>
          </div>

          <div className={styles["hero-slide"]}>
            <div className={styles["hero-content"]}>
              <h1 className={styles.mlt23}>COZY HOODIES</h1>
              <p>Relax in style with our comfortable hoodie collection</p>
            </div>
          </div>

          <div className={styles["hero-slide"]}>
            <div className={styles["hero-content"]}>
              <h1 className={styles.mlt23}>COMFORT PANTS</h1>
              <p>
                Experience ultimate comfort with our stylish pants collection
              </p>
            </div>
          </div>

          <div className={styles["hero-slide"]}>
            <div className={styles["hero-content"]}>
              <h1 className={styles.mlt12}>SUMMER SHORTS</h1>
              <p>Stay cool and trendy with our summer shorts collection</p>
            </div>
          </div>
        </div>
      </section>
      

      {/* Categories Section */}
      <section className={styles.categories}>
        <h2 className={styles["section-title"]}>SHOP BY CATEGORY</h2>
        <div className={styles["category-grid"]}>
          <Link href="/Shirts?sort=newest">
            <div className={styles["category-card"]}>
              <h3> SHIRTS</h3>
              <p>Formal Collection</p>
            </div>
          </Link>
          <Link href="/Hoodies?sort=newest">
            <div className={styles["category-card"]}>
              <h3> HOODIES</h3>
              <p>Comfort Wear</p>
            </div>
          </Link>
          <Link href="/Pants?sort=newest">
            <div className={styles["category-card"]}>
              <h3> TROUSERS</h3>
              <p>All Styles & Fits</p>
            </div>
          </Link>
          <Link href="/Shorts?sort=newest">
            <div className={styles["category-card"]}>
              <h3> SHORTS</h3>
              <p>Summer Collection</p>
            </div>
          </Link>
        </div>
      </section>

      <FeatureProduct featureItems={featureItems} />
      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles["footer-content"]}>
          <div className={styles["footer-section"]}>
            <h3>Contact Information</h3>
            <div className={styles["contact-info"]}>
              <div className={styles["contact-item"]}>
                <span className={styles["contact-icon"]}>
                  <FaRegAddressCard />
                </span>
                <div>
                  <strong>Address</strong>
                  <br />
                  Palo Alto, California(US)
                </div>
              </div>
              <div className={styles["contact-item"]}>
                <span className={styles["contact-icon"]}>📞</span>
                <div>
                  <strong>Phone</strong>
                  <br />
                  +1 (555) 123-4567
                </div>
              </div>
              <div className={styles["contact-item"]}>
                <span className={styles["contact-icon"]}>✉️</span>
                <div>
                  <strong>Email</strong>
                  <br />
                  info@VissyWears.com
                </div>
              </div>
              <div className={styles["contact-item"]}>
                <span className={styles["contact-icon"]}>🕒</span>
                <div>
                  <strong>Hours</strong>
                  <br />
                  Mon-Sat: 9AM-8PM
                </div>
              </div>
            </div>
          </div>

          <div className={styles["footer-section"]}>
            <h3>Customer Service</h3>
            <a href="#" onClick={(e) => e.preventDefault()}>
              Refund Policy
            </a>
            <a href="#" onClick={(e) => e.preventDefault()}>
              Shipping Information
            </a>
            <a href="#" onClick={(e) => e.preventDefault()}>
              Size Guide
            </a>
            <a href="#" onClick={(e) => e.preventDefault()}>
              Track Your Order
            </a>
            <a href="#" onClick={(e) => e.preventDefault()}>
              Return & Exchange
            </a>
            <a href="#" onClick={(e) => e.preventDefault()}>
              Product Warranty
            </a>
            <a href="#" onClick={(e) => e.preventDefault()}>
              24/7 Support
            </a>
          </div>

          <div className={styles["footer-section"]}>
            <h3>Company</h3>
            <a href="#" onClick={(e) => e.preventDefault()}>
              About StyleHub
            </a>
            <a href="#" onClick={(e) => e.preventDefault()}>
              Careers
            </a>
            <a href="#" onClick={(e) => e.preventDefault()}>
              Press & Media
            </a>
          </div>
        </div>

        <div className={styles["footer-bottom"]}>
          <div className={styles["footer-logo"]}>VissyWears</div>
          <div style={{ color: "white" }}>
            © 2024 VissyWears. All rights reserved.
          </div>
        </div>
      </footer>
      <Chatbot/>
    </div>
  );
}
