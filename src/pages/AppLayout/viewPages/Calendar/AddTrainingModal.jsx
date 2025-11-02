import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addTraining } from "../../../../store/features/trainingSlice";
import styles from "./AddTrainingModal.module.css";

export default function AddTrainingModal({
  show,
  onClose,
  coachId,
  teamId,
  preselectedDate,
}) {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    description: "",
  });

  // 👇 aktualizuj date, gdy preselectedDate się zmieni
  useEffect(() => {
    if (preselectedDate) {
      const formattedDate = new Date(preselectedDate)
        .toISOString()
        .split("T")[0];
      setForm((prev) => ({ ...prev, date: formattedDate }));
    }
  }, [preselectedDate]);

  if (!show) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTraining = {
      TrainingID: Date.now(),
      Title: form.title,
      Description: form.description,
      StartTime: `${form.date}T${form.startTime}`,
      EndTime: `${form.date}T${form.endTime}`,
      CoachID: coachId || "user-coach-001",
      TeamID: teamId || 1,
    };

    dispatch(addTraining(newTraining));
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Dodaj trening</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Tytuł treningu"
            value={form.title}
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />

          <div className={styles.timeRow}>
            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              required
            />
            <span>—</span>
            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              required
            />
          </div>

          <textarea
            name="description"
            placeholder="Opis treningu"
            value={form.description}
            onChange={handleChange}
          />

          <button type="submit" className={styles.submitBtn}>
            Zapisz
          </button>
        </form>

        <button onClick={onClose} className={styles.closeBtn}>
          Zamknij
        </button>
      </div>
    </div>
  );
}
