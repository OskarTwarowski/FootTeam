import { useForm } from "react-hook-form";
import styles from "./ProfileCreateForm.module.css";
import Button from "../../../../components/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import { CreateProfileSchema } from "../../../../Hooks/validators";
import { Modal } from "react-bootstrap";

function ProfileCreateForm({ show, onClose }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(CreateProfileSchema),
    mode: "onChange",
  });

  const onSubmit = (data) => {
    const existingProfiles = JSON.parse(localStorage.getItem("Profiles"));
    existingProfiles.push(data);
    localStorage.setItem("Profiles", JSON.stringify(existingProfiles));
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header>
        <Modal.Title>Stwórz Zawodnika</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.row}>
            <label htmlFor="firstName">Imię:</label>
            <input
              id="firstName"
              {...register("firstName")}
              placeholder="Jan"
            />
            {errors.firstName && (
              <p className={styles.error}>{errors.firstName.message}</p>
            )}
          </div>

          <div className={styles.row}>
            <label htmlFor="lastName">Nazwisko:</label>
            <input
              id="lastName"
              {...register("lastName")}
              placeholder="Kowalski"
            />
            {errors.lastName && (
              <p className={styles.error}>{errors.lastName.message}</p>
            )}
          </div>

          <div className={styles.row}>
            <label htmlFor="phone">Numer telefonu:</label>
            <input id="phone" {...register("phone")} placeholder="123456789" />
            {errors.phone && (
              <p className={styles.error}>{errors.phone.message}</p>
            )}
          </div>

          <div className={styles.row}>
            <label htmlFor="teamCode">Kod drużyny:</label>
            <input
              id="teamCode"
              {...register("teamCode")}
              placeholder="np. ABC123"
            />
            {errors.teamCode && (
              <p className={styles.error}>{errors.teamCode.message}</p>
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
