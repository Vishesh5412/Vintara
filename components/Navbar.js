import React from "react";
import styles from "./Navbar.module.css";
import Link from "next/link";
import Router from "next/router";
import { motion, AnimatePresence } from "framer-motion";

import { useCart } from "../context/cart/cartContext";
import { useAuth } from "../context/user/userContext";
import { useLoading } from "../context/loadingContext";
import { useAlert } from "../context/alertContext";

import { LuAlignLeft } from "react-icons/lu";
import { IoCart } from "react-icons/io5";
import { FaHome, FaUser, FaUserCircle } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { MdOutlineClose } from "react-icons/md";
import { useState, useEffect } from "react";
const Navbar = () => {
  const { cartItems } = useCart();
  const { userLog, setUserLog } = useAuth();
  const { setProgress } = useLoading();
  const { showToast } = useAlert();

  const [authCart, setAuthCart] = useState(false); //to set up sidebar like appearence for user (login, register, and logout);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  const sidebarVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0 },
    exit: { x: "-100%" },
  };

  async function handleLogout() {
    setProgress(30);
    localStorage.removeItem("authToken");
    setUserLog(null);
    await fetch("/api/logout");
    setProgress(100);
    Router.push("/login");
    return showToast("success", "Logout successfull");
  }
  return (
    <>
      <AnimatePresence>
        {isSideBarOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={sidebarVariants}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className={styles.sidebar}
          >
            <MdOutlineClose
              className={styles.Jhgff}
              onClick={() => setIsSideBarOpen(false)}
            />
            <div className={styles.topH}>Menu</div>
            <ul className={styles.lstHd}>
              <li className={styles.lstItem}>
                <Link href="/">Home</Link>
              </li>
              <li className={styles.lstItem}>
                <Link href="/cart">
                  Cart{" "}
                  {cartItems.length > 0 ? (
                    <span style={{ color: "red" }}>({cartItems.length})</span>
                  ) : (
                    ""
                  )}
                </Link>
              </li>

              {!userLog && (
                <>
                  <li className={styles.lstItem}>
                    <Link href="/signup">Register</Link>
                  </li>
                  <li className={styles.lstItem}>
                    <Link href="/login">Login</Link>
                  </li>
                </>
              )}
              {userLog && (
                <>
                  <li className={styles.lstItem}>
                    <Link href="/cart">My Account</Link>
                  </li>
                  <li className={styles.lstItem}>
                    <Link href="/" onClick={handleLogout}>
                      Logout
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className={styles.navbar}>
        <LuAlignLeft
          className={styles.sdbr}
          onClick={() => setIsSideBarOpen(true)}
        />
        <div className={styles.logo}>Vintara</div>
        <div className={styles["nav-right"]}>
          <Link href="/">
            <button className={`${styles["nav-btn"]} ${styles["cart-btn"]}`}>
              <FaHome className={styles.icon} />
            </button>
          </Link>

          <Link href="/cart">
            <button className={`${styles["nav-btn"]} ${styles["cart-btn"]}`}>
              <IoCart className={styles.icon} />
              <GoDotFill
                className={`${styles["crt"]}`}
                style={{ display: cartItems.length === 0 ? "none" : "block" }}
              />
            </button>
          </Link>

          <button
            className={`${styles["nav-btn"]} ${styles["login-btn"]}`}
            onMouseEnter={() => setAuthCart(true)}
            onClick={() => setAuthCart(!authCart)}
          >
            <FaUserCircle className={styles.icon} />
          </button>
        </div>
      </nav>
      {authCart && (
        <div
          className={styles.cartStyle}
          onMouseLeave={() => setAuthCart(false)}
        >
          <ul>
            {!userLog && (
              <>
                <Link href={"/signup"}>
                  <li className={styles.classList}>New account</li>
                </Link>
                <Link href={"/login"}>
                  <li className={styles.classList}>Login</li>
                </Link>
              </>
            )}

            {userLog && (
              <>
                <Link href={"/user/MyAccount"}>
                  {" "}
                  <li className={styles.classList}>My account</li>
                </Link>
                <li className={styles.classList}>My Orders</li>
                <li className={styles.classList} onClick={handleLogout}>
                  Logout
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </>
  );
};

export default Navbar;
