import { useState } from "react";
import styles from "../Notification/NotificationModal.module.css";
import Button from "../../../../components/Button";

function NotificationModal({ title, onClose, onSubmit }) {
  const [formData, setFormData] = useState({ title: "", description: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim() && formData.description.trim()) {
      onSubmit(formData);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{title}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Tytuł
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Opis
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
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
