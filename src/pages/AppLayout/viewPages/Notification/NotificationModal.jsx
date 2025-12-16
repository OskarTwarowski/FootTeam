import { useState } from "react";
import styles from "./NotificationModal.module.css";
import Button from "../../../../components/Button";

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

    if (!form.title.trim()) {
      alert("Tytuł jest wymagany");
      return;
    }

    onSubmit(form);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.heading}>{title}</h3>

        <p className={styles.subtitle}>Uzupełnij treść powiadomienia</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label>
            Tytuł
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Np. Zmiana godziny treningu"
              required
            />
          </label>

          <label>
            Treść
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Wpisz treść powiadomienia..."
              rows={4}
            />
          </label>

          <div className={styles.actions}>
            <Button type="secondary" onClick={onClose}>
              Anuluj
            </Button>
            <Button type="primary" submit>
              Zapisz
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NotificationModal;
