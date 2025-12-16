import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./ProfileList.module.css";

import ConfirmModal from "../../../../components/ConfirmModal";
import { setActiveProfile } from "../../../../store/features/activeProfileSlice";

import {
  fetchProfiles,
  removeProfile,
} from "../../../../store/features/profileSlice";

import { fetchTeams } from "../../../../store/features/teamSlice";

import { Trash2, Phone } from "lucide-react";

function ProfileList() {
  const dispatch = useDispatch();

  const profiles = useSelector((state) => state.profiles.list);
  const teams = useSelector((state) => state.teams.list);
  const activeProfile = useSelector((state) => state.activeProfile.profile);
  const loggedUser = useSelector((state) => state.auth.user);

  const [showModal, setShowModal] = useState(false);
  const [selectedProfileToDelete, setSelectedProfileToDelete] = useState(null);

  // === POBIERANIE PROFILI UŻYTKOWNIKA ===
  useEffect(() => {
    if (!loggedUser) return;
    if (!loggedUser.userId) return;

    dispatch(fetchProfiles());
    dispatch(fetchTeams());
  }, [loggedUser?.userId]);

  // === MODAL USUWANIA ===
  const handleDeleteClick = (profile, e) => {
    e.stopPropagation();
    setSelectedProfileToDelete(profile);
    setShowModal(true);
  };

  const confirmDelete = () => {
    dispatch(removeProfile(selectedProfileToDelete.playerID));
    setShowModal(false);
  };

  // === USTAWIENIE AKTYWNEGO PROFILU ===
  const handleProfileClick = (profile) => {
    dispatch(setActiveProfile(profile));
  };

  if (!profiles || profiles.length === 0) {
    return <p className={styles.noProfile}>Brak zapisanych profili.</p>;
  }
  console.log(profiles);
  return (
    <div className={styles.container}>
      <div className={styles.tableHeader}>
        <div className={styles.headerCell}>Imię i nazwisko</div>
        <div className={styles.headerCell}>Drużyna</div>
        <div className={styles.headerCell}>Telefon</div>
        <div className={styles.headerCellAction}></div>
      </div>

      <ul className={styles.list}>
        {profiles.map((profile) => {
          const team = teams.find((t) => t.teamID === profile.teamID);

          return (
            <li key={profile.playerID} className={styles.item}>
              <button
                className={`${styles.itemButton} ${
                  activeProfile?.playerID === profile.playerID
                    ? styles.active
                    : ""
                }`}
                onClick={() => handleProfileClick(profile)}
              >
                <span className={`${styles.name} ${styles.textColor}`}>
                  {profile.firstName} {profile.lastName}
                </span>

                <span className={`${styles.team} ${styles.textColor}`}>
                  {team ? team.name : "Brak drużyny"}
                </span>

                <span className={`${styles.phone} ${styles.textColor}`}>
                  <Phone className={styles.phonesvg} />
                  {profile.phoneNumber || "—"}
                </span>

                <span
                  className={`${styles.delete} ${styles.textColor}`}
                  onClick={(e) => handleDeleteClick(profile, e)}
                >
                  <Trash2 className={styles.delete} />
                </span>
              </button>
              gi
            </li>
          );
        })}
      </ul>

      <ConfirmModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmDelete}
        title="Potwierdź usunięcie profilu"
      >
        <p>
          Czy na pewno chcesz usunąć profil{" "}
          <strong>
            {selectedProfileToDelete?.firstName}{" "}
            {selectedProfileToDelete?.lastName}
          </strong>
          ?
        </p>
      </ConfirmModal>
    </div>
  );
}

export default ProfileList;
