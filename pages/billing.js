import { useState , useEffect} from "react";
import styles from "../styles/BillingSummary.module.css";
import { CiLock } from "react-icons/ci";
import { useCart } from "../context/cart/cartContext";
import Link from "next/link";
const BillingSummary = ({
  shipping = 50,
  tax = 0,
  discount = 0,
  currency = "₹",
  itemCount = 0,
  onPayment = () => {},
}) => {
  const { cartItems, totalPrice, setOverAllPrice } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const total = totalPrice + shipping + tax - discount;
  
  useEffect(()=>{
    setOverAllPrice(total);
  }, [totalPrice])

  const formatPrice = (amount) => {
    return `${currency}${amount.toFixed(2)}`;
  };

  return (
    <div className={styles.billingSummary}>
      <div className={styles.header}>
        <h3 className={styles.title}> Summary</h3>
        <div className={styles.badge}>
          {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
        </div>
      </div>

      <div className={styles.priceBreakdown}>
        <div className={styles.priceRow}>
          <span className={styles.priceLabel}>Subtotal</span>
          <span className={styles.priceValue}>{formatPrice(totalPrice)}</span>
        </div>

        {shipping > 0 && (
          <div className={styles.priceRow}>
            <span className={styles.priceLabel}>Shipping</span>
            <span className={styles.priceValue}>{formatPrice(shipping)}</span>
          </div>
        )}

        {tax > 0 && (
          <div className={styles.priceRow}>
            <span className={styles.priceLabel}>Tax</span>
            <span className={styles.priceValue}>{formatPrice(tax)}</span>
          </div>
        )}

        {discount > 0 && (
          <div className={styles.priceRow}>
            <span className={styles.priceLabel}>Discount</span>
            <span className={styles.priceValue}>-{formatPrice(discount)}</span>
          </div>
        )}

        <div className={`${styles.priceRow} ${styles.totalRow}`}>
          <span className={styles.priceLabel}>Total</span>
          <span className={styles.priceValue}>{formatPrice(total)}</span>
        </div>
      </div>

      <div className={styles.paymentSection}>
        <Link href={'/checkout'}>
          <button className={styles.payButton}>
            {isProcessing
              ? "Processing..."
              : `Continue to Payment ${formatPrice(total)}`}
          </button>
        </Link>
        <div className={styles.securityBadge}>
          <CiLock className={styles.lockIcon} />
          Secure SSL Encrypted Payment
        </div>
      </div>
    </div>
  );
};

export default BillingSummary;
