import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchNotifications,
  addNotification as addNotificationThunk,
} from "../../../../store/features/notificationSlice";

import styles from "./NotificationView.module.css";
import Button from "../../../../components/Button";
import NotificationModal from "../Notification/NotificationModal";

function NotificationView() {
  const dispatch = useDispatch();

  const activeProfile = useSelector((state) => state.activeProfile.profile);
  const notifications = useSelector((state) => state.notifications.list);

  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showGlobalModal, setShowGlobalModal] = useState(false);

  // ✅ helpery ról
  const isCoach = activeProfile?.role === "Coach";
  const isAdmin = activeProfile?.role === "Admin";

  // ---- Pobieranie powiadomień ----
  useEffect(() => {
    if (!activeProfile) return;

    if (isAdmin) {
      dispatch(fetchNotifications(null));
      return;
    }

    // Coach / Player → tylko drużyna
    if (activeProfile.TeamID) {
      dispatch(fetchNotifications(activeProfile.TeamID));
    }
  }, [dispatch, activeProfile, isAdmin]);

  // ---- Dodawanie powiadomienia ----
  const handleAddNotification = async (data, isGlobal = false) => {
    const payload = {
      Title: data.title,
      Description: data.description,
      StartTime: new Date().toISOString(),
      EndTime: null,
      CreatedBy: activeProfile?.UserID,
      TeamID: isGlobal ? null : activeProfile?.TeamID,
    };

    await dispatch(addNotificationThunk(payload));

    // refresh
    dispatch(fetchNotifications(isGlobal ? null : activeProfile?.TeamID));
  };

  // ---- Brak powiadomień ----
  if (!notifications.length) {
    return <p className={styles.empty}>Brak powiadomień</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.buttonContainer}>
        {/* Coach → drużynowe */}
        {isCoach && (
          <Button type="primary" onClick={() => setShowTeamModal(true)}>
            Dodaj powiadomienie drużyny
          </Button>
        )}

        {/* Admin → globalne */}
        {isAdmin && (
          <Button type="primary" onClick={() => setShowGlobalModal(true)}>
            Dodaj globalne powiadomienie
          </Button>
        )}
      </div>

      <ul className={styles.list}>
        {notifications.map((n) => (
          <li key={n.NotificationID} className={styles.item}>
            <h3 className={styles.title}>{n.Title}</h3>
            <p className={styles.description}>{n.Description}</p>

            <span className={styles.date}>
              {n.StartTime
                ? new Date(n.StartTime).toLocaleString()
                : "Brak daty"}
            </span>

            <span className={styles.team}>
              {n.TeamName ? `Drużyna: ${n.TeamName}` : "Globalne"}
            </span>
          </li>
        ))}
      </ul>

      {/* Modal drużynowy */}
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

      {/* Modal globalny */}
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
