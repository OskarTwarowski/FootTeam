import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import styles from "./SettingsView.module.css";

import { toggleLightMode } from "../../../store/features/settingsSlice";
import { logout } from "../../../store/features/authSlice";
import { clearProfiles } from "../../../store/features/profileSlice";

import ChangeEmailModal from "./ChangeEmailModal";
import ChangePasswordModal from "./ChangePasswordModal";

import { changeEmail, changePassword } from "../../../API/auth";

function SettingsView() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const { lightMode } = useSelector((state) => state.settings);

  // === ZMIANA EMAIL ===
  const handleEmailSubmit = async (newEmail) => {
    await changeEmail(newEmail);
    alert("Email został zmieniony!");
    setShowEmailModal(false);
  };

  // === ZMIANA HASŁA ===
  const handlePasswordSubmit = async (oldPass, newPass) => {
    await changePassword(oldPass, newPass);
    alert("Hasło zostało zmienione!");
    setShowPasswordModal(false);
  };

  const handleToggleTheme = () => {
    dispatch(toggleLightMode());
  };

  const handleLogOut = () => {
    dispatch(clearProfiles());
    dispatch(logout());
    navigate("/", { replace: true });
  };

  const handleContactClick = () => {
    window.location.href =
      "mailto:support@example.com?subject=Kontakt%20z%20aplikacji";
  };

  return (
    <div className={styles.settings}>
      {/* Lewa kolumna */}
      <div className={styles.buttonList}>
        <button
          className={styles.buttonSettings}
          onClick={() => setShowEmailModal(true)}
        >
          Zmień email
        </button>

        <button
          className={styles.buttonSettings}
          onClick={() => setShowPasswordModal(true)}
        >
          Zmień hasło
        </button>

        <button className={styles.buttonSettings} onClick={handleToggleTheme}>
          Motyw: {lightMode ? "Ciemny 🌙" : "Jasny ☀️"}
        </button>

        <button className={styles.buttonSettings} onClick={handleContactClick}>
          Kontakt mailowy
        </button>

        <button className={styles.delete}>Usuń konto</button>

        <button className={styles.logout} onClick={handleLogOut}>
          Wyloguj się
        </button>
      </div>

      {showEmailModal && (
        <ChangeEmailModal
          onClose={() => setShowEmailModal(false)}
          onSubmit={handleEmailSubmit}
        />
      )}

      {showPasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowPasswordModal(false)}
          onSubmit={handlePasswordSubmit}
        />
      )}

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
