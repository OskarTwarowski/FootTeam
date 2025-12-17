import { useForm } from "react-hook-form";
import styles from "./ProfileCreateForm.module.css";
import Button from "../../../../components/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import { CreateProfileSchema } from "../../../../Hooks/validators";
import { Modal } from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import { addProfile } from "../../../../store/features/profileSlice";

function ProfileCreateForm({ show, onClose }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

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
      FirstName: data.FirstName,
      LastName: data.LastName,
      PhoneNumber: data.Phone || null,
      TeamCode: data.TeamCode,
      UserID: user.userId,
    };

    dispatch(addProfile(payload))
      .unwrap()
      .then(() => onClose())
      .catch(() => alert("Nie udało się stworzyć profilu"));
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header>
        <Modal.Title>Stwórz Zawodnika</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {/* Imię */}
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

          {/* Nazwisko */}
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

          {/* Numer telefonu */}
          <div className={styles.row}>
            <label htmlFor="Phone">Numer telefonu:</label>
            <input id="Phone" {...register("Phone")} placeholder="123456789" />
            {errors.Phone && (
              <p className={styles.error}>{errors.Phone.message}</p>
            )}
          </div>

          {/* Kod drużyny */}
          <div className={styles.row}>
            <label htmlFor="TeamCode">Kod drużyny:</label>
            <input
              id="TeamCode"
              {...register("TeamCode")}
              placeholder="np. ABC123"
            />
            {errors.TeamCode && (
              <p className={styles.error}>{errors.TeamCode.message}</p>
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
