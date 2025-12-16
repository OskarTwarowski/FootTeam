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
  const notifications = useSelector((state) => state.notifications.list);

  // 🔑 ROLE – JEDYNA POPRAWNA LOGIKA
  const isAdmin = user?.Role === "Admin"; // Z USERA
  const isCoach = activeProfile?.role === "Coach"; // Z PLAYERA

  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showGlobalModal, setShowGlobalModal] = useState(false);

  // ---- POBIERANIE POWIADOMIEŃ ----
  useEffect(() => {
    if (!user) return;

    if (isAdmin) {
      dispatch(fetchNotifications(null));
      return;
    }

    if (activeProfile?.teamID) {
      dispatch(fetchNotifications(activeProfile.teamID));
    }
  }, [dispatch, user?.userId, isAdmin, activeProfile?.teamID]);

  // ---- DODAWANIE POWIADOMIENIA ----
  const handleAddNotification = async (data, isGlobal = false) => {
    const payload = {
      Title: data.title,
      Description: data.description,
      StartTime: new Date().toISOString(),
      EndTime: null,
      CreatedBy: user?.userId,
      TeamID: isGlobal ? null : activeProfile?.teamID,
    };

    await dispatch(addNotificationThunk(payload));

    dispatch(fetchNotifications(isGlobal ? null : activeProfile?.teamID));
  };

  return (
    <div className={styles.container}>
      {/* ===== PRZYCISKI – ZAWSZE RENDEROWANE ===== */}
      <div className={styles.buttonContainer}>
        {isCoach && (
          <Button type="primary" onClick={() => setShowTeamModal(true)}>
            Dodaj powiadomienie drużyny
          </Button>
        )}

        {isAdmin && (
          <Button type="primary" onClick={() => setShowGlobalModal(true)}>
            Dodaj globalne powiadomienie
          </Button>
        )}
      </div>

      {/* ===== LISTA / PUSTO ===== */}
      {notifications.length === 0 ? (
        <p className={styles.empty}>Brak powiadomień</p>
      ) : (
        <ul className={styles.list}>
          {notifications.map((n) => (
            <li key={n.NotificationID} className={styles.item}>
              <h3 className={styles.title}>{n.Title}</h3>
              <p className={styles.description}>{n.Description}</p>

              <span className={styles.date}>
                {n.StartTime
                  ? new Date(n.StartTime).toLocaleString("pl-PL")
                  : "Brak daty"}
              </span>

              <span className={styles.team}>
                {n.TeamName ? `Drużyna: ${n.TeamName}` : "Globalne"}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* ===== MODALE ===== */}
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
