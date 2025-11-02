import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import styles from "./ConfirmModal.module.css";

function ConfirmModal({ show, onClose, onConfirm, title, children }) {
  const [confirmationText, setConfirmationText] = useState("");

  const handleConfirm = () => {
    if (confirmationText.toLowerCase() === "potwierdzam") {
      onConfirm();
      setConfirmationText("");
    } else {
      alert('Aby potwierdzić, wpisz dokładnie: "potwierdzam"');
    }
  };

  const handleClose = () => {
    setConfirmationText("");
    onClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title || "Potwierdź akcję"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className={styles.body}>
          {children}

          <p className={styles.info}>
            Aby kontynuować, wpisz <strong>potwierdzam</strong> w polu poniżej:
          </p>

          <Form.Control
            type="text"
            placeholder="potwierdzam"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
          />
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Anuluj
        </Button>
        <Button variant="danger" onClick={handleConfirm}>
          Potwierdź
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmModal;
