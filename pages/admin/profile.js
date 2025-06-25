import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import styles from "../../styles/MyAccount.module.css";
import UserModel from "../../models/UserModel";
import connectToDatabase from "../../config/mongoose";
import Link from "next/link";
// import cookie from "cookie";
// import jwt from "jsonwebtoken";
// import { useAuth } from "../../context/user/userContext";
import { notFound } from "next/navigation";

export async function getServerSideProps(context) {
  
  await connectToDatabase();
  let user = await UserModel.findOne({isAdmin: true}).lean();
  console.log(user);
  if (!user) {
    return { notFound: true };
  }
  return {
    props: { user: JSON.parse(JSON.stringify(user)) },
  };
}

const Profile = ({ user }) => {
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.title}>My Account</h1>

        <div className={styles.field}>
          <label className={styles.label}>Name</label>
          <div className={styles.mailDv}>{user.name}</div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Email</label>
          <div className={styles.mailDv}>{user.email}</div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Phone number</label>
          <div className={styles.mailDv}>{user.phone}</div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Address</label>
          <div className={styles.mailDv}>{user.address}</div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>State</label>
          <div className={styles.mailDv}>{user.state}</div>
        </div>

        <Link href={"/admin/add-product"}>
          <p className={styles.vSjnk}>👉🏼 Add products</p>
        </Link>
        <Link href={"/admin/orders"}>
          <p className={styles.vSjnk}> 👉🏼 View recent orders</p>
        </Link>
        <Link href={"/admin/fetch-all"}>
          {" "}
          <p className={styles.vSjnk}>👉🏼View all the items</p>
        </Link>
        <Link href={"/admin/out-of-stock"}>
          <p className={styles.vSjnk}>👉🏼View Out-of-Stock items</p>{" "}
        </Link>
      </div>
    </>
  );
};

export default Profile;
