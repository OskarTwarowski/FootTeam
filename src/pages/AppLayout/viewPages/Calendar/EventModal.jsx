import styles from "./EventModal.module.css";

function EventModal({ event, onClose }) {
  if (!event) return null;

  const startDate = new Date(event.start);
  const endDate = new Date(event.end);

  const formattedDate = startDate.toLocaleDateString("pl-PL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = `${startDate.toLocaleTimeString("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
  })} – ${endDate.toLocaleTimeString("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>{event.title}</h2>
        <div className={styles.timeBox}>
          <p className={styles.date}>{formattedDate}</p>
          <p className={styles.time}>{formattedTime}</p>
        </div>
        <p className={styles.description}>
          {event.Description || "Brak opisu treningu."}
        </p>
        <button className={styles.closeButton} onClick={onClose}>
          Zamknij
        </button>
      </div>
    </div>
  );
}

export default EventModal;
