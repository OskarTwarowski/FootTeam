import { useDispatch, useSelector } from "react-redux";
import styles from "./SettingsView.module.css";
import {
  setFontSize,
  toggleLightMode,
} from "../../../store/features/settingsSlice";

function SettingsView() {
  const dispatch = useDispatch();
  const { lightMode, fontSize } = useSelector((state) => state.settings);
  const handleToggleTheme = () => {
    dispatch(toggleLightMode());
  };
  const handleFontSizeChange = () => dispatch(setFontSize());

  return (
    <div className={styles.settings}>
      <h2 className={styles.SettingsThumbnail}>Ustawienia </h2>
      <div className={styles.buttonList}>
        <button className={styles.buttonSettings}>Ustawienia Konta</button>
        <button className={styles.buttonSettings} onClick={handleToggleTheme}>
          Motyw: {lightMode ? "Ciemny 🌙" : "Jasny ☀️"}
        </button>
        <button
          className={styles.buttonSettings}
          onClick={handleFontSizeChange}
        >
          {fontSize ? "pomniejsz" : "powiększ"} czcionke
        </button>
        <button className={styles.delete}>Usuń konto </button>
        <button className={styles.logout}>Wyloguj się</button>
      </div>
    </div>
  );
}

export default SettingsView;
