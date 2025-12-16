import { createPortal } from "react-dom";
import { useState } from "react";
import styles from "./NotificationModal.module.css";

function NotificationModal({ title, onClose, onSubmit }) {
  const [form, setForm] = useState({ title: "", description: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
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
            placeholder="Treść"
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
    </div>,
    document.body
  );
}

export default NotificationModal;
