import styles from "./ProfileButton.module.css";

function ProfileButton() {
  return (
    <div className={styles.profile}>
      <h2 className={styles.username}>Cristiano Ronaldo</h2>
      <p className={styles.role}>Trener</p>
    </div>
  );
}

export default ProfileButton;
