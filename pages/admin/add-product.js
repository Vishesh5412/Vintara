import Navbar from "../../components/Navbar";
import styles from "../../styles/MyAccount.module.css";
import React from "react";
import UserModel from "../../models/UserModel";
import connectToDatabase from "../../config/mongoose";
import { useState } from "react";
import { useAlert } from "../../context/alertContext";
import { useLoading } from "../../context/loadingContext";
import { notFound } from "next/navigation";

export async function getServerSideProps({ req, res }) {
  await connectToDatabase();
  let user = await UserModel.findOne({ isAdmin: true }).lean();
  if (!user) {
    return {
      notFound: true,
    };
  }
  return {
    props: {user: JSON.parse(JSON.stringify(user))},
  };
}

const AddProduct = () => {
  const { showToast } = useAlert();
  const { setProgress } = useLoading();
  const slugify = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^a-z0-9\-]/g, "") // Remove invalid characters
      .replace(/\-+/g, "-"); // Remove multiple dashes
  };

  const [formData, setFormData] = useState({
    image: "",
    category: "Shirts",
    name: "",
    slug: "",
    desc: "",
    price: "",
    originalPrice: "",
    sizes: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); //can also write setFormData((prev)=>...prev, [name]:value)
  };
  //to handle size change
  const handleSizeChange = (e) => {
    const { value } = e.target;
    let isPresent = formData.sizes.includes(value);
    let updatedArr = isPresent
      ? formData.sizes.filter((size) => size !== value)
      : [...formData.sizes, value];
    setFormData({ ...formData, sizes: updatedArr });
  };
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const updatedData = { ...formData, slug: slugify(formData.slug) };
      const response = await fetch("/api/add-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updatedData }),
      });
      if (!response.ok) {
        return showToast("error", "Unable to add product");
      }
      setFormData({
        image: "",
        category: "",
        name: "",
        slug: "",
        desc: "",
        price: "",
        originalPrice: "",
        sizes: [],
      });

      return showToast("success", "Product added successfully");
    } catch (err) {
      console.log("Unable to add product", err);
      showToast("error", "Unable to add product");
    }
  }

  
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.title}>Upload Product</h1>

        <form className={styles.form} onSubmit={(e) => handleSubmit(e)}>
          <div className={styles.field}>
            <label className={styles.label}>Image</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Enter image link"
              name="image"
              value={formData.image}
              onChange={(e) => handleChange(e)}
              spellCheck="false"
              minLength={5}
              required
            />
          </div>

          <select
            id="category"
            name="category"
            className={styles.input}
            onChange={(e) => handleChange(e)}
            required
          >
            <option value="Shirts">Shirts</option>
            <option value="Hoodies">Hoodies</option>
            <option value="Shorts">Shorts</option>
            <option value="Pants">Pants</option>
          </select>

          <div className={styles.flexDv}>
            <input
              type="text"
              placeholder="Enter Selling Price(in Rs)"
              className={styles.input}
              name="price"
              value={formData.price}
              onChange={(e) => handleChange(e)}
              spellCheck="false"
              required
            />
            &nbsp;
            <input
              type="text"
              placeholder="Enter Original Price(in Rs)"
              className={styles.input}
              name="originalPrice"
              value={formData.originalPrice}
              onChange={(e) => handleChange(e)}
              spellCheck="false"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Name</label>
            <input
              type="title"
              className={styles.input}
              name="name"
              value={formData.name}
              spellCheck="false"
              onChange={(e) => handleChange(e)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Slug</label>
            <input
              type="text"
              className={styles.input}
              spellCheck="false"
              name="slug"
              value={formData.slug}
              onChange={(e) => handleChange(e)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <textarea
              className={styles.textarea}
              rows="3"
              spellCheck="false"
              value={formData.desc}
              name="desc"
              onChange={(e) => handleChange(e)}
            ></textarea>
          </div>

          <fieldset
            className={styles.input}
            onChange={handleSizeChange}
            required
          >
            <legend>Select Available Sizes:</legend>

            {["S", "M", "L", "XL", "2XL"].map((size) => (
              <label key={size}>
                <input
                  type="checkbox"
                  name="sizes"
                  value={size}
                  checked={formData.sizes.includes(size)} // ✅ Bind to state
                  onChange={handleSizeChange}
                  // ✅ Ensure handler is here
                />
                &nbsp;
                {size}
              </label>
            ))}
          </fieldset>

          <button type="submit" className={styles.button}>
            Upload Product
          </button>
        </form>
      </div>
    </>
  );
};

export default AddProduct;
