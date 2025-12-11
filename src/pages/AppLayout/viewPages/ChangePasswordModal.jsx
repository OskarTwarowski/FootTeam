import { useState } from "react";
import styles from "./SettingsModal.module.css";
import Button from "../../../components/Button";

export default function ChangePasswordModal({ onClose, onSubmit }) {
  const [oldPassword, setOld] = useState("");
  const [newPassword, setNew] = useState("");

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.nazwa}>Zmień hasło</h2>

        <input
          type="password"
          placeholder="Stare hasło"
          value={oldPassword}
          onChange={(e) => setOld(e.target.value)}
        />

        <input
          type="password"
          placeholder="Nowe hasło"
          value={newPassword}
          onChange={(e) => setNew(e.target.value)}
        />

        <div className={styles.actions}>
          <Button type="secondary" onClick={onClose}>
            Anuluj
          </Button>
          <Button
            type="primary"
            onClick={() => onSubmit(oldPassword, newPassword)}
          >
            Zapisz
          </Button>
        </div>
      </div>
    </div>
  );
}
