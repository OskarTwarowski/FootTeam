import Team from "../components/Team";
import styles from "../components/View.module.css";

function View() {
  return (
    <div className={styles.widokContainer}>
      <Team />
    </div>
  );
}

export default View;
