import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { useAuth } from "../context/user/userContext";
import { useAlert } from "../context/alertContext";
import { useLoading } from "../context/loadingContext";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebaseClient";

import Navbar from "../components/Navbar";
import styles from "../styles/auth.module.css";
const Login = () => {
  const router = useRouter();
  const { handleUserLog } = useAuth();
  const { setProgress } = useLoading();
  const { showToast } = useAlert();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setProgress(30);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { user } = userCredential;
      const idToken = await user.getIdToken();

      // Step 3: Call your backend API and send the ID token for verification
      const response = await fetch("/api/sessionLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`, // send token for backend to verify
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        setEmail("");
        setPassword("");
        setProgress(100);
        return showToast("error", "Authentication failed");
      }
      const data = await response.json();
      localStorage.setItem("authToken", data.token);
      if (data.user && data.user.isAdmin) {
        router.push("/admin/profile");
        handleUserLog();
        setProgress(100);
        return showToast("success", "Login successful");
      }
      router.push("/");
      handleUserLog();
      setProgress(100);
      return showToast("success", "Login successful");
    } catch (err) {
      setProgress(100);
      console.log("User login failed", err);
      setEmail("");
      setPassword("");
      if (
        err.code === "auth/invalid-credential" ||
        err.code == "auth/user-not-found"
      ) {
        return showToast("error", "Invalid credential");
      }
      showToast("error", "Unexpected server error, Try again.");
    }
  }
  return (
    <>
      <Navbar />
      <div className={styles.wrapper}>
        <div className={styles.loginBox}>
          <p className={styles.hdng}>Login your account</p>
          or
          <Link href="/signup" className={styles.sde12}>
            Register
          </Link>
          <br /> <br />
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              spellCheck="false"
              required
            />
            <br />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              spellCheck="false"
              required
            />{" "}
            <br />
            <Link href="/forgot-password">
              <p className={styles.fgt}>Forgot your password?</p>
            </Link>{" "}
            <br />
            <button type="submit" className={styles.sbtbtn}>
              Sign In
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
