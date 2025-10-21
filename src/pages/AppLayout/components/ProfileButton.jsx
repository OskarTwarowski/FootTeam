import styles from "./ProfileButton.module.css";
import { FAKE_USERS } from "../../../mockData";
import { useEffect, useState } from "react";

function ProfileButton() {
  // do usunięcie

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  if (!user) return <p>Brak danych użytkownika — zaloguj się ponownie.</p>;
  //-------------------------------------------------------------

  return (
    <div className={styles.profile}>
      <h2 className={styles.username}>{user.Username}</h2>
      <p className={styles.role}>{user.Role}</p>
    </div>
  );
}

export default ProfileButton;
