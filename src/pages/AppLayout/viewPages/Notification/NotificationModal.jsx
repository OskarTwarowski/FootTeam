import styles from "./NotificationModal.module.css";
import { useState } from "react";

function NotificationModal({ title, onClose, onSubmit }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{title}</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Tytuł"
            value={form.title}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Treść powiadomienia"
            value={form.description}
            onChange={handleChange}
            required
          />

          <div className={styles.actions}>
            <button type="submit">Zapisz</button>
            <button type="button" onClick={onClose}>
              Anuluj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NotificationModal;
