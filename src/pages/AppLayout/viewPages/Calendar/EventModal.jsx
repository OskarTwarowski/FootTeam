import styles from "./EventModal.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteTraining,
  fetchTrainings,
} from "../../../../store/features/trainingSlice";

function EventModal({ event, onClose }) {
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.auth.user?.Role);

  if (!event) return null;

  const trainingId = event.TrainingID;
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

  const handleDelete = async () => {
    if (!window.confirm("Czy na pewno chcesz usunąć ten trening?")) return;

    try {
      await dispatch(deleteTraining(trainingId)).unwrap();
      await dispatch(fetchTrainings());
      onClose();
    } catch (err) {
      alert("Nie udało się usunąć treningu.");
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>{event.title}</h2>

        <div className={styles.timeBox}>
          <p className={styles.date}>{formattedDate}</p>
          <p className={styles.time}>{formattedTime}</p>
        </div>

        <p className={styles.description}>
          {event.Description?.trim()
            ? event.Description
            : "Brak opisu treningu."}
        </p>

        {(userRole === "Coach" || userRole === "Admin") && (
          <div className={styles.actions}>
            <button className={styles.deleteBtn} onClick={handleDelete}>
              Usuń trening
            </button>

            <button
              className={styles.editBtn}
              onClick={() => alert("Tu dodamy modal edycji!")}
            >
              Edytuj trening
            </button>
          </div>
        )}

        <button className={styles.closeButton} onClick={onClose}>
          Zamknij
        </button>
      </div>
    </div>
  );
}

export default EventModal;
