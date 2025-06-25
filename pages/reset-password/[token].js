import React, { useState } from "react";
import crypto from "crypto";
import Navbar from "../../components/Navbar";
import styles from "../../styles/auth.module.css";
import Router from "next/router";
import UserModel from "../../models/UserModel";
import { useAlert } from "../../context/alertContext";
import { useAuth } from "../../context/user/userContext";

import { useRouter } from "next/router";

export async function getServerSideProps(context) {
  const { token } = context.params;
  if (!token) {
    return { notFound: true };
  }
  let hashedToken = crypto
    .createHash("sha256")
    .update(context.params.token)
    .digest("hex");

  let user = UserModel.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  }); //here date.now() will be run immediately when this line runs
  if (!user) {
    return { notFound: true };
  }
  return {
    props: {}, // ✅ returns nothing to the component, but renders the page
  };
}

const ResetPassword = () => {
  const { handleUserLog } = useAuth();
  const router = useRouter();
  const { token } = router.query;

  const { showToast } = useAlert();
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== rePassword) {
      setRePassword("");
      return showToast("error", "Password not match");
    }
    const response = await fetch("/api/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, password }),
    });
    if (!response.ok) {
      return showToast("error", "Some internal error occured");
    }
    Router.push("/");
    let data = await response.json();
    localStorage.setItem("authToken", data.jwtToken);
    handleUserLog();
    showToast("success", "Password changed successfully");
  };

  return (
    <>
      <Navbar />
      <div className={styles.wrapper}>
        <div className={styles.loginBox}>
          <p className={styles.hdng}>Reset password</p>

          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              spellCheck="false"
              minLength={7}
              required
            />{" "}
            <br />
            <input
              type="password"
              placeholder="Confirm-Password"
              name="password"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              spellCheck="false"
              minLength={7}
              required
            />{" "}
            <br />
            <button type="submit" className={styles.sbtbtn}>
              Reset
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
