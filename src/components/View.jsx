import Team from "./Team";
import styles from "./View.module.css";

function View() {
  return (
    <div className={styles.widokContainer}>
      <Team />
    </div>
  );
}

export default View;
