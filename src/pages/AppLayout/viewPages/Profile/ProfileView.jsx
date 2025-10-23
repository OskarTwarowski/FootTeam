import ProfileModalButton from "../Profile/ProfileModalButton";
import styles from "./ProfileView.module.css";

export default function ProfileView() {
  return (
    <div className={styles.profileBox}>
      <div className={styles.profileList}>
        <p>Lista profili</p>
      </div>
      <div className={styles.profileButtons}>
        <ProfileModalButton />
        <button>usuń profil</button>
      </div>
    </div>
  );
}
