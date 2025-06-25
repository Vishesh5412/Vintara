import React from "react";
import Navbar from "../components/Navbar";
import BackToTopButton from "../components/BackToTopButton";
import BillingSummary from "./billing";
import { useState, useEffect } from "react";
import styles from "../styles/cart.module.css";
import { IoBagHandleOutline } from "react-icons/io5";
import { useCart } from "../context/cart/cartContext";
import { useAuth } from "../context/user/userContext";
import { useAlert } from "../context/alertContext";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";

const Cart = () => {
  const { cartItems, setCartItems, updateCart, setTotalPrice } = useCart(); //to store the color , size and id or product
  const { userLog } = useAuth();
  const { showToast } = useAlert();

  const [detailedItems, setDetailedItems] = useState([]); //to store all the info , for them api is used
  const [isUpperLoaded, setIsUpperLoaded] = useState(false); //to render the lower compoent after the above

  //function to remove cartItem
  const handleRemove = async (cartEntryId) => {
    try {
      const updatedCart = cartItems.filter(
        (flag) => flag.cartEntryId !== cartEntryId
      );
      if (userLog !== null) {

        const response = await fetch("/api/update-cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userLog._id,
            userCart: updatedCart,
          }),
        });
        if (!response.ok) {
          console.log("Unable to update user cart");
          return showToast("error", "Unable to update cart, try again");
        } else {
          console.log("Cart updated successfully");
        }
      }
      setCartItems(updatedCart);
      if (updatedCart !== 0) {
        localStorage.setItem("cartArr", JSON.stringify(updatedCart));
      } else {
        localStorage.removeItem("cartArr");
      }
    } catch (err) {
      console.error("Unable to delete", err);
      setCartItems([]);
    }
  };

  useEffect(() => {
    if (cartItems.length === 0) {
      return;
    }
    const fetchCartDetails = async () => {
      try {
        const response = await fetch("/api/getcartdetails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cartItems),
        });

        if (!response.ok) {
          setDetailedItems([]);
          localStorage.removeItem("cartArr");
          return;
        }
        const data = await response.json();
        setDetailedItems(data.mergedData); //settting the details in detailedItems useState
        setIsUpperLoaded(true);
        updateTotalMoney();
      } catch (err) {
        console.log("Cart items fetching failed");
      }
    };

    fetchCartDetails();
  }, [cartItems]);

  //function to handle quantity change
  const handleQuantityChange = async (cardId, num) => {
    try {
      const cartArr = JSON.parse(localStorage.getItem("cartArr"));
      for (const item of cartArr) {
        if (item.cartEntryId === cardId) {
          item.quantity = num;
          break;
        }
      }
      localStorage.setItem("cartArr", JSON.stringify(cartArr));
      if (userLog !== null) {
        let response = await fetch("/api/update-cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userLog._id,
            userCart: cartArr,
          }),
        });
        if (response.ok) {
          const data = await response.json();

          updateCart();
          // updateTotalMoney();
          return showToast("success", "Quantity updated successfully");
        }
        return showToast("error", "Something went wrong");
      }
      updateCart();
      return showToast("success", "Quantity updated successfully");
    } catch (err) {
      console.log("Unable to update quantity", err);
      return showToast("error", "An unexpected error occurred");
    }
  };

  function updateTotalMoney() {
    let currPrice = 0;
    for (const item of detailedItems) {
      currPrice += Number(item.quantity) * Number(item.price);
    }
    setTotalPrice(currPrice);
  }

  useEffect(() => {
    updateTotalMoney();
  }, [detailedItems]);

  return (
    <>
      <Navbar />
      {cartItems.length === 0 ? (
        <div className={styles.emptyCont}>
          <IoBagHandleOutline className={styles.bgEmpt} />
          <h2>Your cart is emtpy</h2> <br />
          <Link href={"/"}>
            <button className={styles.bck}>Back to Hompage</button>
          </Link>
        </div>
      ) : (
        <>
          {detailedItems && (
            <div className={styles.cartContainer}>
              <div className={styles.cartItems}>
                {detailedItems.map((item) => (
                  <div className={styles.productCard} key={item.cartEntryId}>
                    <div className={styles.productHeader}>
                      <div className={styles.productImage}>
                        <Link href={`/products/${item._id}/${item.slug}`}>
                          <img
                            src={item.image}
                            alt="Premium Oversized SILVER Cotton T-Shirt"
                          />
                        </Link>
                      </div>

                      <div className={styles.productInfo}>
                        <div className={styles.productTitleSection}>
                          <h3 className={styles.productTitle}></h3>
                          <button
                            className={styles.removeBtn}
                            onClick={() => handleRemove(`${item.cartEntryId}`)}
                          >
                            REMOVE
                          </button>
                        </div>

                        <div className={styles.priceSection}>
                          <span className={styles.currentPrice}>
                            ₹{item.price}
                          </span>
                          <span className={styles.originalPrice}>
                            ₹{item.originalPrice}
                          </span>
                          <span className={styles.discount}>
                            ({item.calDiscount}% off)
                          </span>
                        </div>

                        <div className={styles.savings}>
                          You saved ₹{item.calSaving}
                        </div>
                      </div>
                    </div>

                    <div className={styles.productOptions}>
                      <div className={styles.optionGroup}>
                        <span className={styles.optionLabel}>
                          Size: {item.size}
                        </span>
                      </div>

                      <div className={styles.optionGroup}>
                        <span className={styles.optionLabel}>
                          Color: {item.color}
                        </span>
                      </div>

                      <div className={styles.optionGroup}>
                        <span className={styles.optionLabel}>
                          Qty: &nbsp;
                          <select
                            className={styles.optionSelect}
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                item.cartEntryId,
                                parseInt(e.target.value, 10)
                              )
                            }
                          >
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                          </select>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {isUpperLoaded && <BillingSummary />}
            </div>
          )}
          <BackToTopButton/>
        </>
      )}
    </>
  );
};

export default Cart;
