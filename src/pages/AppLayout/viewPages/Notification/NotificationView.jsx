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

  const activeProfile = useSelector((state) => state.activeProfile.profile);
  const userRole = useSelector((state) => state.auth.user?.Role);
  const notifications = useSelector((state) => state.notifications.list);

  const isAdmin = userRole === "Admin";
  const isCoach = activeProfile?.role === "Coach";

  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showGlobalModal, setShowGlobalModal] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchNotifications(null));
    } else if (activeProfile?.teamID) {
      dispatch(fetchNotifications(activeProfile.teamID));
    }
  }, [dispatch, isAdmin, activeProfile]);

  const handleAdd = async (data, isGlobal) => {
    const payload = {
      Title: data.title,
      Description: data.description,
      StartTime: new Date().toISOString(),
      TeamID: isGlobal ? null : activeProfile.teamID,
    };

    await dispatch(addNotification(payload));
    dispatch(fetchNotifications(isGlobal ? null : activeProfile.teamID));
  };

  const teamNotifications = notifications.filter((n) => n.TeamID);
  const globalNotifications = notifications.filter((n) => !n.TeamID);

  return (
    <div className={styles.container}>
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

      {teamNotifications.length > 0 && (
        <>
          <h3>Drużynowe</h3>
          <ul>
            {teamNotifications.map((n) => (
              <li key={n.NotificationID}>
                <strong>{n.Title}</strong>
                <p>{n.Description}</p>
              </li>
            ))}
          </ul>
        </>
      )}

      {globalNotifications.length > 0 && (
        <>
          <h3>Globalne</h3>
          <ul>
            {globalNotifications.map((n) => (
              <li key={n.NotificationID}>
                <strong>{n.Title}</strong>
                <p>{n.Description}</p>
              </li>
            ))}
          </ul>
        </>
      )}

      {showTeamModal && (
        <NotificationModal
          title="Powiadomienie drużyny"
          onClose={() => setShowTeamModal(false)}
          onSubmit={(data) => handleAdd(data, false)}
        />
      )}

      {showGlobalModal && (
        <NotificationModal
          title="Powiadomienie globalne"
          onClose={() => setShowGlobalModal(false)}
          onSubmit={(data) => handleAdd(data, true)}
        />
      )}
    </div>
  );
}

export default NotificationView;
