import { useEffect, useState } from "react";
import { getNotifications } from "../../../../services/NotificationService";
import { useSelector } from "react-redux";
import styles from "./NotificationView.module.css";

function NotificationView() {
  const activeProfile = useSelector((state) => state.activeProfile.profile);
  const [notifications, setNotifications] = useState([]);
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

  if (!notifications.length) {
    return <p className={styles.empty}>Brak powiadomień</p>;
  }

  return (
    <div className={styles.container}>
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
    </div>
  );
}

export default NotificationView;
