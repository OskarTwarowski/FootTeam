import { useForm } from "react-hook-form";
import styles from "./ProfileCreateForm.module.css";
import Button from "../../../../components/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import { CreateProfileSchema } from "../../../../Hooks/validators";
import { Modal } from "react-bootstrap";

//
import { addProfile } from "../../../../services/ProfileService";

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
    window.dispatchEvent(new Event("storage"));

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
            <label htmlFor="Phone">Numer telefonu:</label>
            <input id="Phone" {...register("Phone")} placeholder="123456789" />
            {errors.Phone && (
              <p className={styles.error}>{errors.Phone.message}</p>
            )}
          </div>

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
