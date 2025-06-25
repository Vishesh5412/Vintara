// context/carteContext.js
import { createContext, useState, useContext, useEffect } from "react";
const CartContext = createContext();

export function CartProvider({ children }) {
  // function to check whether cart is being updated or not

  //useState fucntion return krta hai
  const [cartItems, setCartItems] = useState([]);

  //to store the local cart
  useEffect(() => {
    const stored = localStorage.getItem("cartArr");
    if (stored) {
      try {
        setCartItems(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse cartArr", e);
      }
    }
  }, []);

  //parse method shows error for empty null
  function updateCart() {
    try {
      const cartArr = localStorage.getItem("cartArr");
      const parsed = cartArr ? JSON.parse(cartArr) : [];
      setCartItems(parsed);
    } catch (error) {
      console.error("Failed to update cart:", error);
      setCartItems([]); // fallback to empty cart
    }
  }

  const [totalPrice, setTotalPrice] = useState(0);
  const [overAllPrice, setOverAllPrice] = useState(0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        updateCart,
        totalPrice,
        setTotalPrice,
        setOverAllPrice,
        overAllPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
