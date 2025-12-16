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

  // ===== ROLE =====
  const isAdmin = user?.Role === "Admin"; // z USERA
  const isCoach = activeProfile?.role === "Coach"; // z PLAYERA

  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showGlobalModal, setShowGlobalModal] = useState(false);
  console.log("🔥 NotificationView render");

  // ===== FETCH =====
  useEffect(() => {
    if (!user) return;

    if (isAdmin) {
      dispatch(fetchNotifications(null));
    } else if (activeProfile?.teamID) {
      dispatch(fetchNotifications(activeProfile.teamID));
    }
  }, [dispatch, user, isAdmin, activeProfile?.teamID]);

  // ===== FILTR ŚMIECI Z BACKENDU =====
  const visibleNotifications = notifications.filter(
    (n) => n.Title?.trim() || n.Description?.trim()
  );

  console.log("ACTIVE PROFILE:", activeProfile);
  console.log("FETCH TEAM ID:", activeProfile?.teamID);
  // ===== ADD =====
  const handleAddNotification = async (data, isGlobal = false) => {
    const payload = {
      Title: data.title,
      Description: data.description,
      StartTime: new Date().toISOString(),
      EndTime: null,
      CreatedBy: user.userId,
      TeamID: isGlobal ? null : activeProfile.teamID,
    };

    try {
      await dispatch(addNotificationThunk(payload)).unwrap();

      await dispatch(
        fetchNotifications(isGlobal ? null : activeProfile.teamID)
      );
    } catch (err) {
      console.error("Błąd dodawania powiadomienia:", err);
    }
  };

  return (
    <div className={styles.container}>
      {/* ===== PRZYCISKI ===== */}
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

      {/* ===== LISTA ===== */}
      {visibleNotifications.length === 0 ? (
        <p className={styles.empty}>Brak powiadomień</p>
      ) : (
        <ul className={styles.list}>
          {visibleNotifications.map((n) => (
            <li key={n.NotificationID} className={styles.item}>
              <h3 className={styles.title}>{n.Title}</h3>

              {n.Description && (
                <p className={styles.description}>{n.Description}</p>
              )}

              <div className={styles.meta}>
                <span className={styles.date}>
                  {n.StartTime
                    ? new Date(n.StartTime).toLocaleString("pl-PL")
                    : "Brak daty"}
                </span>

                <span className={styles.team}>
                  {n.TeamName ? `Drużyna: ${n.TeamName}` : "Globalne"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* ===== MODAL DRUŻYNOWY ===== */}
      {showTeamModal && (
        <NotificationModal
          title="Nowe powiadomienie drużyny"
          onClose={() => setShowTeamModal(false)}
          onSubmit={(data) => {
            handleAddNotification(data, false);
            setShowTeamModal(false);
          }}
        />
      )}

      {/* ===== MODAL GLOBALNY ===== */}
      {showGlobalModal && (
        <NotificationModal
          title="Nowe globalne powiadomienie"
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
