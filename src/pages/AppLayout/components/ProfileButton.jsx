import styles from "./ProfileButton.module.css";
import { useSelector } from "react-redux";

function ProfileButton() {
  const user = useSelector((state) => state?.auth?.user);

  const roleMap = {
    Parent: "Rodzic",
    Coach: "Trener",
    Admin: "Administrator",
  };

  return (
    <div className={styles.profile}>
      {!user && <p>Brak danych użytkownika.</p>}

      <h2 className={styles.username}>{user?.email ?? "—"}</h2>

      <p className={styles.role}>{roleMap[user?.role] ?? "—"}</p>
    </div>
  );
}

export default ProfileButton;
