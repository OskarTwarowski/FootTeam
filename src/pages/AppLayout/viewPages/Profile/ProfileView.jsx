import ProfileModalButton from "../Profile/ProfileModalButton";
import styles from "./ProfileView.module.css";
import ProfileList from "../Profile/ProfileList";

export default function ProfileView() {
  return (
    <div className={styles.profileBox}>
      <h1 className={styles.header}>Lista profili</h1>
      <div className={styles.profileList}>
        <ProfileList />
      </div>
      <div className={styles.profileButtons}>
        <ProfileModalButton />
        <button>usuń profil</button>
      </div>
    </div>
  );
}
