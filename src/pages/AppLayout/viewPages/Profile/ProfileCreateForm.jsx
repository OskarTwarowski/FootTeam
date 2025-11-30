import { useForm } from "react-hook-form";
import styles from "./ProfileCreateForm.module.css";
import Button from "../../../../components/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import { CreateProfileSchema } from "../../../../Hooks/validators";
import { Modal } from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import { createProfile } from "../../../../store/features/profileSlice";
import { fetchTeams } from "../../../../store/features/teamSlice";
import { useEffect } from "react";

function ProfileCreateForm({ show, onClose }) {
  const dispatch = useDispatch();

  const { list: teams } = useSelector((state) => state.teams);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchTeams());
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(CreateProfileSchema),
    mode: "onChange",
  });

  const onSubmit = (data) => {
    if (!user) return alert("Musisz być zalogowany!");

    const payload = {
      firstName: data.FirstName,
      lastName: data.LastName,
      teamID: Number(data.TeamID),
      userID: user.userId,
    };

    dispatch(createProfile(payload))
      .unwrap()
      .then(() => {
        onClose();
      })
      .catch(() => alert("Nie udało się stworzyć profilu"));
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header>
        <Modal.Title>Stwórz Zawodnika</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.row}>
            <label htmlFor="FirstName">Imię:</label>
            <input
              id="FirstName"
              {...register("FirstName")}
              placeholder="Jan"
            />
            {errors.FirstName && (
              <p className={styles.error}>{errors.FirstName.message}</p>
            )}
          </div>

          <div className={styles.row}>
            <label htmlFor="LastName">Nazwisko:</label>
            <input
              id="LastName"
              {...register("LastName")}
              placeholder="Kowalski"
            />
            {errors.LastName && (
              <p className={styles.error}>{errors.LastName.message}</p>
            )}
          </div>

          <div className={styles.row}>
            <label htmlFor="TeamID">Drużyna:</label>
            <select id="TeamID" {...register("TeamID")}>
              <option value="">Wybierz...</option>
              {teams.map((team) => (
                <option key={team.teamID} value={team.teamID}>
                  {team.name}
                </option>
              ))}
            </select>

            {errors.TeamID && (
              <p className={styles.error}>{errors.TeamID.message}</p>
            )}
          </div>

          <Button type="primary" disabled={!isValid}>
            Zapisz
          </Button>
        </form>
      </Modal.Body>

      <Modal.Footer>
        <button className={styles.cancelButton} onClick={onClose}>
          Anuluj
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default ProfileCreateForm;
