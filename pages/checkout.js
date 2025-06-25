import React, { useState, useEffect, use } from "react";
import Navbar from "../components/Navbar";
import styles from "../styles/CheckoutForm.module.css";
import Link from "next/link";
import Head from "next/head";
import Script from "next/script";
import { useCart } from "../context/cart/cartContext";
import { useAuth } from "../context/user/userContext";
import { useAlert } from "../context/alertContext";

const CheckOut = () => {
  const { totalPrice, overAllPrice } = useCart();
  const { userLog } = useAuth();
  const { showToast } = useAlert();

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    address: "",
    state: "",
    pin: "",
  });
  useEffect(() => {
    if (userLog !== null) {
      setFormData({
        email: userLog.email,
        phone: userLog.phone,
        address: userLog.address,
        state: userLog.state,
        pin: userLog.pin,
      });
    }
  }, [userLog]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      return showToast("error", "Invalid phone number");
    }
    if (!/^[1-9]\d{5}$/.test(formData.pin)) {
      return showToast("error", "Invalid pin");
    }
  }
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0"
        />
      </Head>
      <script
        type="application/javascript"
        src="https://securegw-stage.paytm.in/merchantpgpui/checkoutjs/merchants/YOUR_MID.js"
        async
      ></script>
      <Navbar />

      <div className={styles.checkoutContainer}>
        <h2 className={styles.title}>Checkout Details</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              id="email"
              name="email"
              className={styles.input}
              placeholder="Email address"
              onChange={(e) => handleChange(e)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone" className={styles.label}>
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              id="phone"
              name="phone"
              pattern="[6-9][0-9]{9}"
              title="Enter a valid 10-digit phone number"
              className={styles.input}
              placeholder="+91"
              onChange={(e) => handleChange(e)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="address" className={styles.label}>
              Address
            </label>
            <input
              type="text"
              value={formData.address}
              id="address"
              name="address"
              className={styles.input}
              placeholder="Street Address"
              onChange={(e) => handleChange(e)}
              spellCheck={false}
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="state" className={styles.label}>
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                className={styles.input}
                placeholder="State"
                onChange={(e) => handleChange(e)}
                spellCheck={false}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="pin" className={styles.label}>
                Pincode
              </label>
              <input
                type="text"
                id="pincode"
                name="pin"
                pattern="[1-9][0-9]{5}"
                title="Enter a valid pincode"
                value={formData.pin}
                className={styles.input}
                placeholder="Postal Code"
                onChange={(e) => handleChange(e)}
                required
              />
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <Link href={"/cart"}>
              <button type="button" className={styles.secondaryButton}>
                View Cart
              </button>
            </Link>
            <button type="submit" className={styles.primaryButton}>
              Pay Now (₹{overAllPrice})
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CheckOut;
