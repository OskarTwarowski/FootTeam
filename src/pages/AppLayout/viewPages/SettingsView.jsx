import { useDispatch, useSelector } from "react-redux";
import styles from "./SettingsView.module.css";
import { toggleLightMode } from "../../../store/features/settingsSlice";
// dodaj jakieś stockowe zdjęcie

function SettingsView() {
  const dispatch = useDispatch();
  const { lightMode } = useSelector((state) => state.settings);
  const handleToggleTheme = () => {
    dispatch(toggleLightMode());
  };

  const handleContactClick = () => {
    window.location.href =
      "mailto:support@example.com?subject=Kontakt%20z%20aplikacji";
  };

  return (
    <div className={styles.settings}>
      {/* Lewa kolumna: ustawienia */}
      <div className={styles.buttonList}>
        <button className={styles.buttonSettings}>Zmień email</button>
        <button className={styles.buttonSettings}>Zmień hasło</button>
        <button className={styles.buttonSettings} onClick={handleToggleTheme}>
          Motyw: {lightMode ? "Ciemny 🌙" : "Jasny ☀️"}
        </button>
        <button className={styles.buttonSettings} onClick={handleContactClick}>
          Kontakt mailowy
        </button>
        <button className={styles.delete}>Usuń konto</button>
        <button className={styles.logout}>Wyloguj się</button>
      </div>

      {/* Prawa kolumna: kontakt telefoniczny */}
      <div className={styles.contactInfo}>
        <img src="/contact.jpg" alt="Kontakt" className={styles.contactImage} />
        <h2>Skontaktuj się z nami</h2>
        <p>Infolinia: pon-pt 8:00-16:00</p>
        <p>📞 +48 517 114 759</p>
      </div>
    </div>
  );
}

export default SettingsView;
