import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  addNotification,
  removeNotification,
} from "../../../../store/features/notificationSlice";

import styles from "./NotificationView.module.css";
import Button from "../../../../components/Button";
import NotificationModal from "../Notification/NotificationModal";
import Loader from "../../../../components/Loader";

function NotificationView() {
  const dispatch = useDispatch();

  const activeProfile = useSelector((s) => s.activeProfile.profile);
  const user = useSelector((s) => s.auth.user);
  const { list: notifications, status } = useSelector((s) => s.notifications);

  // ===== ROLE =====
  const isAdmin = user?.Role === "Admin";
  const isCoach = activeProfile?.role === "Coach";

  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showGlobalModal, setShowGlobalModal] = useState(false);

  // ===== FETCH =====
  useEffect(() => {
    if (!user) return;

    if (isAdmin) {
      dispatch(fetchNotifications(null));
    } else if (activeProfile?.teamID) {
      dispatch(fetchNotifications(activeProfile.teamID));
    }
  }, [dispatch, user, isAdmin, activeProfile?.teamID]);

  // ===== SORT + CLEAN =====
  const visibleNotifications = useMemo(() => {
    return [...notifications]
      .filter((n) => n.title?.trim() || n.description?.trim())
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
  }, [notifications]);

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

    await dispatch(addNotification(payload)).unwrap();
    dispatch(fetchNotifications(isGlobal ? null : activeProfile.teamID));
  };

  // ===== DELETE =====
  const handleDelete = async (id) => {
    if (!window.confirm("Usunąć to powiadomienie?")) return;

    await dispatch(removeNotification(id)).unwrap();
    dispatch(fetchNotifications(activeProfile.teamID));
  };

  // ===== LOADING =====
  if (status === "loading") {
    return (
      <div className={styles.loaderWrapper}>
        <Loader />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* ===== BUTTONS ===== */}
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

      {/* ===== LIST / EMPTY ===== */}
      {visibleNotifications.length === 0 ? (
        <p className={styles.empty}>Brak powiadomień</p>
      ) : (
        <ul className={styles.list}>
          {visibleNotifications.map((n) => {
            const canDelete =
              isCoach && n.teamID && n.teamID === activeProfile?.teamID;

            return (
              <li key={n.notificationID} className={styles.item}>
                <div className={styles.header}>
                  <h3>{n.title}</h3>

                  {canDelete && (
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(n.notificationID)}
                      title="Usuń"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {n.description && <p>{n.description}</p>}

                <span className={styles.date}>
                  {new Date(n.startTime).toLocaleString("pl-PL")}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {/* ===== MODALS ===== */}
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
