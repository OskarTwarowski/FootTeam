import { useState } from "react";
import styles from "./AdminView.module.css";
import PlayersAdminView from "./PlayersAdminView";
import TeamAdminView from "./TeamAdminView";
function AdminView() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.buttons}>
        <button onClick={() => setIsOpen(false)}>Profile</button>
        <button onClick={() => setIsOpen(true)}>Druzyny</button>
      </div>

      {!isOpen ? <PlayersAdminView /> : <TeamAdminView />}
    </div>
  );
}

export default AdminView;
