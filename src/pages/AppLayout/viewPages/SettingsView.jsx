import { useDispatch, useSelector } from "react-redux";
import styles from "./SettingsView.module.css";
import { toggleLightMode } from "../../../store/features/settingsSlice";

function SettingsView() {
  const dispatch = useDispatch();
  const { lightMode } = useSelector((state) => state.settings);
  const handleToggleTheme = () => {
    dispatch(toggleLightMode());
  };

  return (
    <div className={styles.settings}>
      <div className={styles.buttonList}>
        <button className={styles.buttonSettings}>Zmień email</button>
        <button className={styles.buttonSettings}>Zmień hasło</button>
        <button className={styles.buttonSettings} onClick={handleToggleTheme}>
          Motyw: {lightMode ? "Ciemny 🌙" : "Jasny ☀️"}
        </button>
        <button className={styles.delete}>Usuń konto </button>
        <button className={styles.logout}>Wyloguj się</button>
      </div>
    </div>
  );
}

export default SettingsView;
