import React, { useState } from "react";
import styles from "../styles/auth.module.css";
import Navbar from "../components/Navbar";
import { useAlert } from "../context/alertContext";

const Forget = () => {

  const { showToast } = useAlert();
  const [email, setEmail] = useState('');
  const [showInfo, setShowInfo] = useState(false)  //to tell user about openical their email to view 
  const handleSubmit = async (e) => {
    setShowInfo(true);
    e.preventDefault();
    const response = await fetch("/api/forgot-password", {
      method: "POST",
      headers: {
        //this line tells the server that client is sending data in form of json
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      return showToast('error', 'Updation failed, Try again')
    }
    const data = await response.json();
    return showToast('success', data.message);
  };
  return (
    <>
      <Navbar />
      <div className={styles.wrapper}>
        <div className={styles.loginBox}>
          <p className={styles.hdng}>Forgot Your password</p>
          or
          <a href="/login" className={styles.sde12}>
            login
          </a>
           <br />
          <form onSubmit={handleSubmit}>
            <br />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              spellCheck="false"
              required
            />{" "}
            <br />
            <button type="submit" className={styles.sbtbtn}>
              Continue
            </button>
          </form>
          <br />
          {showInfo && 
          <p className={styles.viXtfG}>If an account with that email exists, we’ve sent a password reset link to your inbox.</p>
          }
        </div>
      </div>
      
    </>
  );
}
export default Forget;
