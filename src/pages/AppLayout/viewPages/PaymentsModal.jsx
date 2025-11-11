// src/components/PaymentModal/PaymentModal.jsx
import { useState } from "react";
import styles from "./PaymentsModal.module.css";

function randomTx() {
  return "TEST_TX_" + Math.random().toString(36).substring(2, 9).toUpperCase();
}

export default function PaymentsModal({
  paymentId,
  amount,
  onClose,
  onSimulate,
}) {
  const [method, setMethod] = useState("blik"); // 'blik' | 'card'
  const [blikCode, setBlikCode] = useState("");
  const [card, setCard] = useState({ number: "", name: "", exp: "", cvc: "" });
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    setError(null);
    // prosta walidacja lokalna
    if (method === "blik") {
      if (!/^\d{6}$/.test(blikCode)) {
        setError("BLIK wymaga 6 cyfr.");
        return;
      }
    } else {
      if (!/^\d{16}$/.test(card.number.replace(/\s+/g, ""))) {
        setError("Numer karty musi mieć 16 cyfr.");
        return;
      }
      if (!card.name) {
        setError("Podaj nazwisko z karty.");
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(card.exp)) {
        setError("Data ważności w formacie MM/RR .");
        return;
      }
      if (!/^\d{3,4}$/.test(card.cvc)) {
        setError("CVC 3-4 cyfry (mock).");
        return;
      }
    }

    setProcessing(true);
    const txId = randomTx();
    const success = Math.random() < 0.9;

    setTimeout(() => {
      setProcessing(false);
      onSimulate({
        id: paymentId,
        success,
        txId,
        method: method === "blik" ? `BLIK (${blikCode})` : "Karta",
      });
    }, 1200);
  };

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <header className={styles.header}>
          <h3>Zapłać {amount} PLN</h3>
          <button
            className={styles.close}
            onClick={onClose}
            aria-label="Zamknij"
          >
            ✕
          </button>
        </header>

        <div className={styles.content}>
          <div className={styles.methodTabs}>
            <button
              className={method === "blik" ? styles.active : ""}
              onClick={() => setMethod("blik")}
            >
              <img
                src="/Blik_logo.jpg"
                alt="Blik-picture"
                className={styles.picture}
              />
              BLIK
            </button>
            <button
              className={method === "card" ? styles.active : ""}
              onClick={() => setMethod("card")}
            >
              <img
                src="/creditcard.png"
                alt="creditCard-picture"
                className={styles.picture}
              />
              Karta
            </button>
          </div>

          {method === "blik" && (
            <div className={styles.form}>
              <label>
                Wprowadź kod BLIK (6 cyfr)
                <input
                  value={blikCode}
                  onChange={(e) =>
                    setBlikCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="123456"
                  inputMode="numeric"
                />
              </label>
            </div>
          )}

          {method === "card" && (
            <div className={styles.form}>
              <label>
                Numer karty
                <input
                  value={card.number}
                  onChange={(e) =>
                    setCard({
                      ...card,
                      number: e.target.value.replace(/\D/g, "").slice(0, 16),
                    })
                  }
                  placeholder="1234 1234 1234 1234"
                  inputMode="numeric"
                />
              </label>

              <label>
                Imię i nazwisko
                <input
                  value={card.name}
                  onChange={(e) => setCard({ ...card, name: e.target.value })}
                  placeholder="Jan Kowalski"
                />
              </label>

              <div className={styles.row}>
                <label>
                  MM/RR
                  <input
                    value={card.exp}
                    onChange={(e) =>
                      setCard({ ...card, exp: e.target.value.slice(0, 5) })
                    }
                    placeholder="04/26"
                  />
                </label>
                <label>
                  CVC
                  <input
                    value={card.cvc}
                    onChange={(e) =>
                      setCard({
                        ...card,
                        cvc: e.target.value.replace(/\D/g, "").slice(0, 4),
                      })
                    }
                    placeholder="123"
                  />
                </label>
              </div>
            </div>
          )}

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.actions}>
            <button
              className={styles.cancel}
              onClick={onClose}
              disabled={processing}
            >
              Anuluj
            </button>
            <button
              className={styles.pay}
              onClick={handlePay}
              disabled={processing}
            >
              {processing ? "Przetwarzanie..." : `Zapłać ${amount} PLN`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
