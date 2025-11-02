import { useForm } from "react-hook-form";
import styles from "./ProfileEditForm.module.css";
import Button from "../../../../components/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import { CreateProfileSchema } from "../../../../Hooks/validators";
import { Modal } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { updateProfile } from "../../../../store/features/profileSlice";

function ProfileEditForm({ show, onClose }) {
  const dispatch = useDispatch();
  const activeProfile = useSelector((state) => state.activeProfile.profile);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: yupResolver(CreateProfileSchema),
    mode: "onChange",
    defaultValues: activeProfile || {},
  });

  useEffect(() => {
    if (activeProfile) {
      reset(activeProfile);
    }
  }, [activeProfile, reset]);

  const onSubmit = (data) => {
    if (!activeProfile) return alert("Brak aktywnego profilu");

    const editedProfile = {
      ...activeProfile,
      ...data,
    };
    dispatch(updateProfile(editedProfile));
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header>
        <Modal.Title>Edytuj Profil Zawodnika</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.row}>
            <label htmlFor="FirstName">Imię</label>
            <input id="FirstName" {...register("FirstName")} />
            {errors.FirstName && (
              <p className={styles.error}>{errors.FirstName.message}</p>
            )}
          </div>

          <div className={styles.row}>
            <label htmlFor="LastName">Nazwisko</label>
            <input id="LastName" {...register("LastName")} />
            {errors.LastName && (
              <p className={styles.error}>{errors.LastName.message}</p>
            )}
          </div>

          <div className={styles.row}>
            <label htmlFor="Phone">Numer telefonu:</label>
            <input id="Phone" {...register("Phone")} />
            {errors.Phone && (
              <p className={styles.error}>{errors.Phone.message}</p>
            )}
          </div>

          <div className={styles.row}>
            <label htmlFor="TeamCode">Kod drużyny:</label>
            <input id="TeamCode" {...register("TeamCode")} />
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

export default ProfileEditForm;
