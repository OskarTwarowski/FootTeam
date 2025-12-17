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

  // ===== ROLE =====
  const isAdmin = user?.Role === "Admin";
  const isCoach = activeProfile?.role === "Coach";

  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showGlobalModal, setShowGlobalModal] = useState(false);

  // ===== FETCH POWIADOMIEŃ =====
  useEffect(() => {
    if (!user) return;

    if (isAdmin) {
      dispatch(fetchNotifications(null));
    } else if (activeProfile?.teamID) {
      dispatch(fetchNotifications(activeProfile.teamID));
    }
  }, [dispatch, user, isAdmin, activeProfile?.teamID]);

  const visibleNotifications = notifications ?? [];

  // ===== ADD =====
  const handleAddNotification = async (data, isGlobal) => {
    const payload = {
      title: data.title.trim(),
      description: data.description.trim(),
      startTime: new Date().toISOString(),
      endTime: null,
      createdBy: user.userId,
      teamID: isGlobal ? null : activeProfile.teamID,
    };

    try {
      await dispatch(addNotification(payload)).unwrap();

      dispatch(fetchNotifications(isGlobal ? null : activeProfile.teamID));
    } catch (err) {
      console.error("Błąd dodawania powiadomienia:", err);
    }
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
            <li key={n.notificationID} className={styles.item}>
              <h3 className={styles.title}>{n.title}</h3>

              {n.description && (
                <p className={styles.description}>{n.description}</p>
              )}

              <div className={styles.meta}>
                <span className={styles.date}>
                  {n.startTime
                    ? new Date(n.startTime).toLocaleString("pl-PL")
                    : "Brak daty"}
                </span>

                <span className={styles.team}>
                  {n.teamID ? "Drużynowe" : "Globalne"}
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
