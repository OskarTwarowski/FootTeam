import { useEffect, useMemo, useState } from "react";
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

  // ===== STATE =====
  const activeProfile = useSelector((s) => s.activeProfile.profile);
  const user = useSelector((s) => s.auth.user);
  const notifications = useSelector((s) => s.notifications.list ?? []);

  // ===== ROLE LOGIC (POPRAWNA) =====
  const isAdmin = user?.Role === "Admin"; // USER
  const isCoach = activeProfile?.role === "Coach"; // PLAYER

  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showGlobalModal, setShowGlobalModal] = useState(false);

  // ===== FETCH =====
  useEffect(() => {
    if (!user) return;

    if (isAdmin) {
      dispatch(fetchNotifications(null)); // wszystkie
      return;
    }

    if (activeProfile?.teamID) {
      dispatch(fetchNotifications(activeProfile.teamID)); // drużyna
    }
  }, [dispatch, user?.userId, isAdmin, activeProfile?.teamID]);

  // ===== 🔥 NORMALIZACJA DANYCH (KLUCZ DO DZIAŁANIA) =====
  const visibleNotifications = useMemo(() => {
    return notifications
      .map((n) => ({
        ...n,
        teamID: n.teamID ?? n.TeamID ?? null,
        title: n.title ?? n.Title ?? "",
        description: n.description ?? n.Description ?? "",
        startTime: n.startTime ?? n.StartTime ?? null,
      }))
      .filter(
        (n) => n.title.trim().length > 0 || n.description.trim().length > 0
      );
  }, [notifications]);

  // ===== ADD =====
  const handleAddNotification = async (data, isGlobal) => {
    if (!user) return;

    const payload = {
      Title: data.title.trim(),
      Description: data.description.trim(),
      StartTime: new Date().toISOString(),
      EndTime: null,
      CreatedBy: user.userId,
      TeamID: isGlobal ? null : activeProfile?.teamID ?? null,
    };

    try {
      await dispatch(addNotification(payload)).unwrap();

      // odśwież listę
      dispatch(
        fetchNotifications(isGlobal ? null : activeProfile?.teamID ?? null)
      );
    } catch (err) {
      console.error("❌ Błąd dodawania powiadomienia:", err);
      alert("Nie udało się dodać powiadomienia");
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
            <li key={n.NotificationID} className={styles.item}>
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
