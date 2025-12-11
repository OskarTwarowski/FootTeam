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
  const user = useSelector((state) => state.auth.user);
  const userRole = user?.Role;

  const notifications = useSelector((state) => state.notifications.list);

  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showGlobalModal, setShowGlobalModal] = useState(false);

  // ---- Pobieranie powiadomień ----
  useEffect(() => {
    if (!user) return;

    // ADMIN → pobiera bez teamID (backend zwraca wszystko)
    if (userRole === "Admin") {
      dispatch(fetchNotifications(null));
      return;
    }

    // Coach / User → musi mieć aktywną drużynę
    if (activeProfile?.TeamID) {
      dispatch(fetchNotifications(activeProfile.TeamID));
    }
  }, [dispatch, activeProfile, userRole, user]);

  // ---- Dodawanie powiadomienia ----
  const handleAddNotification = async (data, isGlobal = false) => {
    const payload = {
      Title: data.title,
      Description: data.description,
      StartTime: new Date().toISOString(),
      EndTime: null,
      CreatedBy: user?.userId, // wymagane przez backend
      TeamId: isGlobal ? null : activeProfile?.TeamID,
    };

    await dispatch(addNotificationThunk(payload));

    // odśwież listę powiadomień
    dispatch(
      fetchNotifications(isGlobal ? null : activeProfile?.TeamID ?? null)
    );
  };

  // ---- Gdy brak powiadomień ----
  if (!notifications.length) {
    return <p className={styles.empty}>Brak powiadomień</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.buttonContainer}>
        {/* Trener → może tworzyć powiadomienia drużynowe */}
        {userRole === "Coach" && (
          <Button type="primary" onClick={() => setShowTeamModal(true)}>
            Dodaj Powiadomienie Drużyny
          </Button>
        )}

        {/* Admin → może tworzyć globalne */}
        {userRole === "Admin" && (
          <Button type="primary" onClick={() => setShowGlobalModal(true)}>
            Dodaj Globalne Powiadomienie
          </Button>
        )}
      </div>

      <ul className={styles.list}>
        {notifications.map((n) => (
          <li key={n.notificationID} className={styles.item}>
            <h3 className={styles.title}>{n.title}</h3>
            <p className={styles.description}>{n.description}</p>
            <span className={styles.date}>
              {n.startTime
                ? new Date(n.startTime).toLocaleString()
                : "Brak daty"}
            </span>
            {n.teamName && (
              <span className={styles.team}>
                Drużyna: {n.teamName ?? "Globalne"}
              </span>
            )}
          </li>
        ))}
      </ul>

      {/* ---- Modal drużynowy ---- */}
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

      {/* ---- Modal globalny ---- */}
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
