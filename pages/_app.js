import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { use, useState } from "react";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { CartProvider } from "../context/cart/cartContext";
import { UserProvider } from "../context/user/userContext";
import { LoadingProvider } from "../context/loadingContext";
import { AlertProvider } from "../context/alertContext";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <UserProvider>
      <CartProvider>
        <LoadingProvider>
          <AlertProvider>
            <Head>
              <title>Vintara - Your Ecommerce Store</title>
              <link
                rel="icon"
                type="image/png"
                sizes="32x32"
                href="/fav-image.png"
              />
               

            </Head>
            <Component {...pageProps} />
            {/* {router.pathname === "/" && <Chatbot />} */}
            <ToastContainer />
          </AlertProvider>
        </LoadingProvider>
      </CartProvider>
    </UserProvider>
  );
}

export default MyApp;
