import { useEffect, useState } from "react";
import {
  getNotifications,
  addNotification,
} from "../../../../services/NotificationService";
import { useSelector } from "react-redux";
import styles from "./NotificationView.module.css";
import Button from "../../../../components/Button";
import NotificationModal from "../Notification/NotificationModal";

function NotificationView() {
  const activeProfile = useSelector((state) => state.activeProfile.profile);
  const [notifications, setNotifications] = useState([]);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showGlobalModal, setShowGlobalModal] = useState(false);
  const userRole = useSelector((state) => state.auth.user?.Role);
  useEffect(() => {
    if (activeProfile?.TeamID) {
      const teamNotifications = getNotifications(activeProfile.TeamID);
      setNotifications(teamNotifications);
    } else {
      const globalNotifications = getNotifications(null).filter(
        (n) => n.TeamID === null
      );
      setNotifications(globalNotifications);
    }
  }, [activeProfile]);

  const handleAddNotification = (data, isGlobal = false) => {
    const newNotification = {
      NotificationID: Date.now(),
      Title: data.title,
      Description: data.description,
      StartTime: new Date().toISOString(),
      TeamID: isGlobal ? null : activeProfile.TeamID,
    };
    addNotification(newNotification);
    setNotifications(getNotifications(isGlobal ? null : activeProfile.TeamID));
  };

  if (!notifications.length) {
    return <p className={styles.empty}>Brak powiadomień</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.buttonContainer}>
        {activeProfile?.Role === "Trener" && (
          <Button type="primary" onClick={() => setShowTeamModal(true)}>
            Dodaj Powiadomienie Drużyny
          </Button>
        )}
        {userRole === "Admin" && (
          <Button type="primary" onClick={() => setShowGlobalModal(true)}>
            Dodaj Globalne Powiadomienie
          </Button>
        )}
      </div>

      <ul className={styles.list}>
        {notifications.map((n) => (
          <li key={n.NotificationID} className={styles.item}>
            <h3 className={styles.title}>{n.Title}</h3>
            <p className={styles.description}>{n.Description}</p>
            <span className={styles.date}>
              {new Date(n.StartTime).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>

      {showTeamModal && (
        <NotificationModal
          title="Dodaj powiadomienie drużyny"
          onClose={() => setShowTeamModal(false)}
          onSubmit={(data) => {
            handleAddNotification(data, false);
            setShowTeamModal(false);
          }}
        />
      )}

      {showGlobalModal && (
        <NotificationModal
          title="Dodaj globalne powiadomienie"
          onClose={() => setShowGlobalModal(false)}
          onSubmit={(data) => {
            handleAddNotification(data, true);
            setShowGlobalModal(false);
          }}
        />
      )}
    </div>
  );
}

export default NotificationView;
