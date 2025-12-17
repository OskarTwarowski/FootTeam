import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  addNotification,
} from "../../../../store/features/notificationSlice";

import styles from "./NotificationView.module.css";
import Button from "../../../../components/Button";
import NotificationModal from "../Notification/NotificationModal";

function NotificationView() {
  const dispatch = useDispatch();

  const activeProfile = useSelector((s) => s.activeProfile.profile);
  const user = useSelector((s) => s.auth.user);
  const notifications = useSelector((s) => s.notifications.list);

  // 🔐 ROLE
  const isAdmin = user?.Role === "Admin"; // Z USERA
  const isCoach = activeProfile?.role === "Coach"; // Z PLAYERA

  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showGlobalModal, setShowGlobalModal] = useState(false);
  console.log("RENDER NotificationView", {
    activeProfile,
    user,
    notifications,
  });

  // ===== FETCH =====
  useEffect(() => {
    if (!user) return;

    if (isAdmin) {
      dispatch(fetchNotifications(null));
    } else if (activeProfile?.teamID) {
      dispatch(fetchNotifications(activeProfile.teamID));
    }
  }, [dispatch, user, isAdmin, activeProfile?.teamID]);

  // ===== USUWAMY ŚMIECI Z BACKENDU =====
  const visibleNotifications = notifications.filter(
    (n) => n.Title?.trim() || n.Description?.trim()
  );

  // ===== ADD =====
  const handleAddNotification = async (data, isGlobal) => {
    const payload = {
      Title: data.title.trim(),
      Description: data.description.trim(),
      StartTime: new Date().toISOString(),
      EndTime: null,
      CreatedBy: user.userId,
      TeamID: isGlobal ? null : activeProfile.teamID, // 🔥 KLUCZ
    };

    await dispatch(addNotification(payload)).unwrap();

    dispatch(fetchNotifications(isGlobal ? null : activeProfile.teamID));
  };

  return (
    <div className={styles.container}>
      {/* ===== PRZYCISKI ===== */}
      <div className={styles.buttonContainer}>
        {isCoach && (
          <Button onClick={() => setShowTeamModal(true)}>
            Dodaj powiadomienie drużyny
          </Button>
        )}
        {isAdmin && (
          <Button onClick={() => setShowGlobalModal(true)}>
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
              <h3>{n.Title}</h3>
              {n.Description && <p>{n.Description}</p>}
              <div className={styles.meta}>
                <span>
                  {n.StartTime
                    ? new Date(n.StartTime).toLocaleString("pl-PL")
                    : "Brak daty"}
                </span>
                <span className={styles.team}>
                  {n.TeamID ? `Drużyna` : "Globalne"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* ===== MODALE ===== */}
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
