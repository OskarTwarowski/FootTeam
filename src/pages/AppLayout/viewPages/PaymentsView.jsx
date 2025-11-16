// src/pages/Payments/PaymentsView.jsx
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./PaymentsView.module.css";

const initialPayments = Array.from({ length: 6 }).map((_, i) => {
  const date = new Date();
  date.setMonth(date.getMonth() + i);
  date.setDate(1);
  return {
    id: i + 1,
    month: date.toLocaleString("pl-PL", { month: "long", year: "numeric" }),
    amount: 30,
    status: "Oczekuje",
  };
});

const PENDING_KEY = "footteam_pending_payment";

export default function PaymentsView() {
  const [payments, setPayments] = useState(initialPayments);
  const [searchParams] = useSearchParams();

  const markPayment = (id, status, extra = {}) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === Number(id) ? { ...p, status, ...extra } : p))
    );
  };

  useEffect(() => {
    const status = searchParams.get("status");
    const clientRef = searchParams.get("client_reference_id");
    const sessionId = searchParams.get("session_id");
    console.log("RETURN URL full:", window.location.href);
    console.log(
      "status:",
      status,
      "client_reference_id:",
      clientRef,
      "session_id:",
      sessionId
    );

    if (!status) return;

    if (clientRef) {
      markPayment(
        clientRef,
        status === "success" ? "Potwierdzono" : "Niepowodzenie",
        {
          lastTx: sessionId || null,
        }
      );
      const pending = JSON.parse(localStorage.getItem(PENDING_KEY) || "null");
      if (pending && String(pending.id) === String(clientRef)) {
        localStorage.removeItem(PENDING_KEY);
      }
      return;
    }
    const pending = JSON.parse(localStorage.getItem(PENDING_KEY) || "null");
    if (pending && pending.id) {
      markPayment(
        pending.id,
        status === "success" ? "Potwierdzono" : "Niepowodzenie",
        {
          lastTx: sessionId || null,
        }
      );
      localStorage.removeItem(PENDING_KEY);
      return;
    }

    console.warn(
      "Powrót ze Stripe bez client_reference_id i bez pendingPayment w localStorage."
    );
  }, [searchParams]);

  const handlePay = (p) => {
    localStorage.setItem(
      PENDING_KEY,
      JSON.stringify({ id: p.id, t: Date.now() })
    );

    const paymentLink = `https://buy.stripe.com/test_dRm5kD53X2E37go8Ip8Ra00?client_reference_id=${p.id}`;

    markPayment(p.id, "Procesowanie");

    window.location.href = paymentLink;
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
              <button className={styles.payButton} onClick={() => handlePay(p)}>
                Zapłać
              </button>
            )}

            {p.status === "Procesowanie" && (
              <button
                className={styles.payButton}
                onClick={() => {
                  const pending = JSON.parse(
                    localStorage.getItem(PENDING_KEY) || "null"
                  );
                  const targetId = pending?.id || p.id;
                  window.location.href = `https://buy.stripe.com/test_dRm5kD53X2E37go8Ip8Ra00?client_reference_id=${targetId}`;
                }}
              >
                Dokończ płatność
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
