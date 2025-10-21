import { useForm } from "react-hook-form";
import styles from "./ProfileView.module.css";

export default function ProfileView() {
  const { register, handleSubmit } = useForm();

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
        </div>

        <div className={styles.row}>
          <label htmlFor="lastName">Nazwisko:</label>
          <input
            id="lastName"
            {...register("lastName")}
            placeholder="Kowalski"
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="phone">Numer telefonu:</label>
          <input id="phone" {...register("phone")} placeholder="123456789" />
        </div>

        <div className={styles.row}>
          <label htmlFor="teamCode">Kod drużyny:</label>
          <input
            id="teamCode"
            {...register("teamCode")}
            placeholder="np. ABC123"
          />
        </div>

        <button type="submit" className={styles.saveBtn}>
          Zapisz
        </button>
      </form>
    </div>
  );
}
