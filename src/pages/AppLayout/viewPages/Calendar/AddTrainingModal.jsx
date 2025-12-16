import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createTraining,
  fetchTrainings,
} from "../../../../store/features/trainingSlice";
import styles from "./AddTrainingModal.module.css";

export default function AddTrainingModal({ show, onClose, preselectedDate }) {
  const dispatch = useDispatch();
  const activeProfile = useSelector((state) => state.activeProfile.profile);

  const [form, setForm] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    description: "",
    location: "",
  });

  useEffect(() => {
    if (preselectedDate) {
      const formatted = new Date(preselectedDate).toISOString().split("T")[0];
      setForm((prev) => ({ ...prev, date: formatted }));
    }
  }, [preselectedDate]);

  if (!show) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!activeProfile?.teamID) {
      alert("Brak drużyny — nie można utworzyć treningu.");
      return;
    }

    const payload = {
      title: form.title,
      description: form.description,
      location: form.location,
      startTime: `${form.date}T${form.startTime}`,
      endTime: `${form.date}T${form.endTime}`,
      coachID: activeProfile.playerID, // ⭐ PLAYER ID = COACH ID
      teamID: activeProfile.teamID, // ⭐ poprawna nazwa
    };

    try {
      await dispatch(createTraining(payload)).unwrap();
      await dispatch(fetchTrainings());
      onClose();
    } catch (err) {
      alert("Nie udało się utworzyć treningu.");
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Dodaj trening</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Tytuł"
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

          <input
            name="location"
            placeholder="Lokalizacja (opcjonalne)"
            value={form.location}
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
