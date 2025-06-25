import React, { useState, useEffect } from "react";
import styles from "./BackToTopButton.module.css";
import { FaLongArrowAltUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const BackToTopButton = () => {
  const [isBtnVisible, setIsBtnVisible] = useState(false);
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsBtnVisible(true);
      } else {
        setIsBtnVisible(false);
      }
    };
    //we can't apply addEventListender to DOM objects but attaching global event listender (like window) is allowed.
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const topVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  };

  return (
    <>
      <AnimatePresence>
        {isBtnVisible && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={topVariants}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{ position: "fixed", bottom: 40, right: 30, zIndex: 100 }}
          >
            <FaLongArrowAltUp
              onClick={scrollToTop}
              className={styles.backtotop}
              title="Go to top"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BackToTopButton;
