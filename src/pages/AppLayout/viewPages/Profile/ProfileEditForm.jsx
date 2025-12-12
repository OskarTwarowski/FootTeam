import { useForm } from "react-hook-form";
import styles from "./ProfileEditForm.module.css";
import Button from "../../../../components/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import { CreateProfileSchema } from "../../../../Hooks/validators";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { updateProfile } from "../../../../store/features/profileSlice";

function ProfileEditForm({ show, onClose }) {
  const dispatch = useDispatch();
  const activeProfile = useSelector((state) => state.activeProfile.profile);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(CreateProfileSchema),
    mode: "onChange",
  });

  // 🔥 USTAWIAMY DANE W INPUTACH
  useEffect(() => {
    if (activeProfile) {
      reset({
        FirstName: activeProfile.firstName,
        LastName: activeProfile.lastName,
        Phone: activeProfile.phoneNumber || "",
        TeamCode: activeProfile.teamCode || "",
      });
    }
  }, [activeProfile, reset]);

  const onSubmit = (data) => {
    dispatch(
      updateProfile({
        id: activeProfile.playerID,
        data: {
          firstName: data.FirstName,
          lastName: data.LastName,
          phoneNumber: data.Phone,
          teamCode: data.TeamCode,
        },
      })
    )
      .unwrap()
      .then(onClose)
      .catch(() => alert("Nie udało się zaktualizować profilu"));
  };

  if (!show) return null;

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header>
        <Modal.Title>Edytuj Profil</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.row}>
            <label>Imię:</label>
            <input {...register("FirstName")} />
            {errors.FirstName && (
              <p className={styles.error}>{errors.FirstName.message}</p>
            )}
          </div>

          <div className={styles.row}>
            <label>Nazwisko:</label>
            <input {...register("LastName")} />
            {errors.LastName && (
              <p className={styles.error}>{errors.LastName.message}</p>
            )}
          </div>

          <div className={styles.row}>
            <label>Telefon:</label>
            <input {...register("Phone")} />
            {errors.Phone && (
              <p className={styles.error}>{errors.Phone.message}</p>
            )}
          </div>

          <div className={styles.row}>
            <label>Kod drużyny:</label>
            <input {...register("TeamCode")} />
            {errors.TeamCode && (
              <p className={styles.error}>{errors.TeamCode.message}</p>
            )}
          </div>

          <Button type="primary" disabled={!isValid}>
            Zapisz zmiany
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

export default ProfileEditForm;
