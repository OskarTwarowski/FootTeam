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

  // 🔑 ROLE
  const userRole = user?.Role; // ADMIN
  const playerRole = activeProfile?.role; // COACH / PLAYER / PARENT

  const isAdmin = userRole === "Admin";
  const isCoach = playerRole === "Coach";

  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showGlobalModal, setShowGlobalModal] = useState(false);

  // ---- POBIERANIE POWIADOMIEŃ ----
  useEffect(() => {
    if (!userRole) return;

    // ADMIN → wszystkie
    if (isAdmin) {
      dispatch(fetchNotifications(null));
      return;
    }

    // COACH / PLAYER → tylko drużynowe
    if (activeProfile?.teamID) {
      dispatch(fetchNotifications(activeProfile.teamID));
    }
  }, [dispatch, activeProfile, userRole, isAdmin]);

  // ---- DODAWANIE POWIADOMIENIA ----
  const handleAddNotification = async (data, isGlobal = false) => {
    if (!activeProfile && !isAdmin) return;

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
      {/* === PRZYCISKI === */}
      <div className={styles.buttonContainer}>
        {/* COACH → drużynowe */}
        {isCoach && (
          <Button type="primary" onClick={() => setShowTeamModal(true)}>
            Dodaj powiadomienie drużyny
          </Button>
        )}

        {/* ADMIN → globalne */}
        {isAdmin && (
          <Button type="primary" onClick={() => setShowGlobalModal(true)}>
            Dodaj globalne powiadomienie
          </Button>
        )}
      </div>

      {/* === LISTA === */}
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

              {n.TeamName && (
                <span className={styles.team}>Drużyna: {n.TeamName}</span>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* === MODAL DRUŻYNOWY === */}
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

      {/* === MODAL GLOBALNY === */}
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
