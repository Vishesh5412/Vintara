import React, { useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";

import { useRouter } from "next/router";
import { useAuth } from "../context/user/userContext";
import { useLoading } from "../context/loadingContext";
import { useAlert } from "../context/alertContext";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebaseClient";

import Navbar from "../components/Navbar";
import styles from "../styles/auth.module.css";

const Signup = () => {
  const router = useRouter();
  const { handleUserLog } = useAuth();
  const { setProgress } = useLoading();
  const { showToast } = useAlert();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (password === rePassword && name && password && email) {
        setProgress(30);

        // Step 1: Create user in Firebase
        let userCredential;

        try {
          userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
        } catch (firebaseError) {
          setProgress(100);
          setName("");
          setEmail("");
          setPassword("");
          setRePassword("");
          if (firebaseError.code === "auth/email-already-in-use") {
            return showToast("error", "Email is already in use.");
          } else if (firebaseError.code === "auth/invalid-email") {
            return showToast("error", "Invalid email address.");
          } else if (firebaseError.code === "auth/weak-password") {
            return showToast("error", "Password is too weak.");
          } else {
            return showToast(
              "error",
              firebaseError.message || "Firebase registration error"
            );
          }
        }

        const user = userCredential.user;

        // Step 2: Get Firebase ID token
        const idToken = await user.getIdToken();

        // Step 3: Send token + user info to your backend to save in MongoDB
        const response = await fetch("/api/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ name, email }), // only public info
        });

        if (!response.ok) {
          user.delete();
          const errorData = await response.json(); // ← Parse the error message
          setProgress(100);
          return showToast("error", errorData.message || "Registration failed");
        } else {
          const data = await response.json();
          // Step 4: Success
          localStorage.setItem("authToken", data.token);
          handleUserLog();
          router.push("/");

          setProgress(100);
          return showToast("success", "Registration successful");
        }
      } else {
        setRePassword("");
        return showToast("error", "Please re-verify password");
      }
    } catch (err) {
      console.error("Caught error:", err);

      // ✅ Check for Firebase error codes
      if (err.code === "auth/email-already-in-use") {
        showToast("error", "Email is already in use.");
      } else if (err.code === "auth/invalid-email") {
        showToast("error", "Invalid email address.");
      } else if (err.code === "auth/weak-password") {
        showToast("error", "Password is too weak.");
      } else {
        // fallback
        showToast("error", err.message || "Unexpected error occurred.");
      }

      setProgress(100);
    }
  }

  return (
    <>
      <Navbar />
      <div className={styles.wrapper}>
        <div className={styles.loginBox}>
          <p className={styles.hdng}>Register your account</p>
          or
          <span>
            <Link href="/login" className={styles.sde12}>
              Log In
            </Link>
          </span>
          <br />
          <br />
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={name}
              name="name"
              onChange={(e) => setName(e.target.value)}
              spellCheck="false"
              required
            />
            <br />
            <input
              type="email"
              placeholder="Email"
              value={email}
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              spellCheck="false"
              required
            />
            <br />
            <input
              type="password"
              placeholder="Password"
              value={password}
              minLength="3"
              name="passworod"
              onChange={(e) => setPassword(e.target.value)}
              spellCheck="false"
              required
            />
            <br />
            <input
              type="password"
              placeholder="Confirm-Password"
              value={rePassword}
              minLength={7}
              name="repassword"
              onChange={(e) => setRePassword(e.target.value)}
              spellCheck="false"
              required
            />{" "}
            <br />
            <button type="submit" className={styles.sbtbtn}>
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
