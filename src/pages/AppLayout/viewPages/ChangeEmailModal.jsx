import { useState } from "react";
import styles from "./SettingsModal.module.css";
import Button from "../../../components/Button";

export default function ChangeEmailModal({ onClose, onSubmit }) {
  const [email, setEmail] = useState("");

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.nazwa}>Zmień email</h2>

        <input
          type="email"
          placeholder="Nowy email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className={styles.actions}>
          <Button type="secondary" onClick={onClose}>
            Anuluj
          </Button>
          <Button type="primary" onClick={() => onSubmit(email)}>
            Zapisz
          </Button>
        </div>
      </div>
    </div>
  );
}
