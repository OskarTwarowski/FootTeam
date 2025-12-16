import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  addNotification,
} from "../../../../store/features/notificationSlice";

import styles from "./NotificationView.module.css";
import Button from "../../../../components/Button";
import NotificationModal from "./NotificationModal";

function NotificationView() {
  const dispatch = useDispatch();

  const notifications = useSelector((state) => state.notifications.list);
  const activeProfile = useSelector((state) => state.activeProfile.profile);
  const user = useSelector((state) => state.auth.user);

  const isAdmin = user?.Role === "Admin";
  const isCoach = activeProfile?.role === "Coach";

  const [modalType, setModalType] = useState(null);
  // null | "TEAM" | "GLOBAL"

  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchNotifications(null));
    } else if (activeProfile?.teamID) {
      dispatch(fetchNotifications(activeProfile.teamID));
    }
  }, [dispatch, isAdmin, activeProfile]);

  const handleSubmit = async (data) => {
    const payload = {
      Title: data.title,
      Description: data.description,
      StartTime: new Date().toISOString(),
      EndTime: null,
      CreatedBy: user.userId,
      TeamID: modalType === "GLOBAL" ? null : activeProfile.teamID,
    };

    await dispatch(addNotification(payload));
    setModalType(null);

    dispatch(
      fetchNotifications(modalType === "GLOBAL" ? null : activeProfile.teamID)
    );
  };

  return (
    <div className={styles.container}>
      {/* ===== HEADER ===== */}
      <div className={styles.header}>
        {isCoach && (
          <Button onClick={() => setModalType("TEAM")}>
            Dodaj powiadomienie drużyny
          </Button>
        )}
        {isAdmin && (
          <Button onClick={() => setModalType("GLOBAL")}>
            Dodaj globalne powiadomienie
          </Button>
        )}
      </div>

      {/* ===== LISTA ===== */}
      {notifications.length === 0 ? (
        <p className={styles.empty}>Brak powiadomień</p>
      ) : (
        <ul className={styles.list}>
          {notifications.map((n) => (
            <li key={n.NotificationID} className={styles.item}>
              <h3>{n.Title}</h3>
              <p>{n.Description}</p>
              <span>{n.TeamName ? `Drużyna: ${n.TeamName}` : "Globalne"}</span>
            </li>
          ))}
        </ul>
      )}

      {/* ===== MODAL (POZA FLOW) ===== */}
      {modalType && (
        <NotificationModal
          title={
            modalType === "GLOBAL"
              ? "Nowe powiadomienie globalne"
              : "Nowe powiadomienie drużyny"
          }
          onClose={() => setModalType(null)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

export default NotificationView;
