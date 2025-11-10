// src/pages/Payments/PaymentsView.jsx
import { useState } from "react";
import styles from "./PaymentsView.module.css";

const initialPayments = Array.from({ length: 6 }).map((_, i) => {
  const date = new Date();
  date.setMonth(date.getMonth() + i);
  date.setDate(1);
  return {
    id: i + 1,
    month: date.toLocaleString("pl-PL", { month: "long", year: "numeric" }),
    amount: 30, // przykładowa kwota
    status: "Oczekuje", // "Oczekuje" | "Procesowanie" | "Potwierdzono"
  };
});

export default function PaymentsView() {
  const [payments, setPayments] = useState(initialPayments);

  const handlePay = (id) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Procesowanie" } : p))
    );

    setTimeout(() => {
      setPayments((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "Potwierdzono" } : p))
      );
    }, 10000); // 10 sekund symulacji
  };

  return (
    <div className={styles.payments}>
      <h1>Płatności</h1>
      <ul className={styles.list}>
        {payments.map((p) => (
          <li key={p.id} className={styles.item}>
            <span>{p.month}</span>
            <span>{p.amount} PLN</span>
            <span className={styles.status}>{p.status}</span>
            {p.status === "Oczekuje" && (
              <button
                className={styles.payButton}
                onClick={() => handlePay(p.id)}
              >
                Zapłać
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
