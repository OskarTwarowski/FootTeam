import { useForm } from "react-hook-form";
import styles from "./ProfileCreateForm.module.css";
import Button from "../../../components/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import { CreateProfileSchema } from "../../../Hooks/validators";
function ProfileCreateForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(CreateProfileSchema),
    mode: "onChange",
  });

  const onSubmit = (data) => {
    console.log("Zapisano profil:", data);
    alert("Dane profilu zapisane (mockowo)");
  };
  return (
    <div className={styles.profileBox}>
      <h2>Profil użytkownika</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.row}>
          <label htmlFor="firstName">Imię:</label>
          <input id="firstName" {...register("firstName")} placeholder="Jan" />
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
    </div>
  );
}

export default ProfileCreateForm;
