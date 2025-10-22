import styles from "./ProfileButton.module.css";
import { FAKE_USERS } from "../../../mockData";
import { useEffect, useState } from "react";

function ProfileButton() {
  const [user] = useState(() => {
    const raw = localStorage.getItem("loggedUser");
    return raw ? JSON.parse(raw) : null;
  });
  console.log(user);
  return (
    <div className={styles.profile}>
      {!user && <p>Brak danych Profilu.</p>}
      <h2 className={styles.username}>{user?.Username ?? "—"}</h2>
      <p className={styles.role}>{user?.Role ?? "—"}</p>
    </div>
  );
}

export default ProfileButton;
