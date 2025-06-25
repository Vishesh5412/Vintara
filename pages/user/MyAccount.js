import Navbar from "../../components/Navbar";
import { useEffect } from "react";
import { useState } from "react";
import styles from "../../styles/MyAccount.module.css";
import jwt from "jsonwebtoken";
import { useAuth } from "../../context/user/userContext";
import { useAlert } from "../../context/alertContext";
import Router from "next/router";

export default function MyAccount() {
  const { userLog , handleUserLog} = useAuth();
  const { showToast } = useAlert();
  if (!userLog) {
    return;
  }
  const [formData, setFormData] = useState({
    id: userLog._id || "",
    name: userLog.name || "",
    phone: userLog.phone || "",
    address: userLog.address || "",
    pin: userLog.pin || "",
    state: userLog.state || "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  async function handleSubmit(e) {
    e.preventDefault();
    console.log(formData);
    try {
      if (!formData.name) {
        return;
      }
      if (formData.phone) {
        const isValidPhone = /^[6-9]\d{9}$/.test(formData.phone);
        if (!isValidPhone) {
          setFormData({ ...formData, phone: "" });
          return showToast("error", "Invalid phone number");
        }
      }
      if (formData.pin) {
        const isValidPincode = /^\d{6}$/.test(formData.pin);
        if (!isValidPincode) {
          setFormData({ ...formData, pin: "" });
          return showToast("error", "Invalid pin code");
        }
      }
      const id = userLog._id;
      const response = await fetch("/api/update-credential", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData }),
      });
      if (!response) {
        return showToast("error", "Something went wrong");
      }
      Router.push("/");
      handleUserLog();
      setFormData({
        name: "",
        phone: "",
        address: "",
        pin: "",
        state: "",
      });
      return showToast("success", "User updated");
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.title}>My Account</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Name</label>
            <input
              type="text"
              className={styles.input}
              name="name"
              value={formData.name}
              onChange={(e) => handleChange(e)}
              spellCheck="false"
              minLength={5}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <div className={styles.mailDv}>{userLog.email}</div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Phone Number</label>
            <input
              type="tel"
              className={styles.input}
              name="phone"
              spellCheck="false"
              maxLength={10}
              value={formData.phone}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Address</label>
            <textarea
              className={styles.textarea}
              rows="3"
              name="address"
              spellCheck="false"
              value={formData.address}
              onChange={(e) => handleChange(e)}
            ></textarea>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>State</label>
            <input
              className={styles.input}
              name="state"
              spellCheck="false"
              value={formData.state}
              onChange={(e) => handleChange(e)}
            ></input>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Pin Code</label>
            <input
              type="text"
              className={styles.input}
              name="pin"
              spellCheck="false"
              value={formData.pin}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <button type="submit" className={styles.button}>
            Update Profile
          </button>
        </form>
      </div>
    </>
  );
}
