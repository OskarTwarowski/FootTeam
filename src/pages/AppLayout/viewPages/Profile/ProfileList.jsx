import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./ProfileList.module.css";
import { removeProfile } from "../../../../services/ProfileService";
import ConfirmModal from "../../../../components/ConfirmModal";
import { setActiveProfile } from "../../../../store/features/activeProfileSlice";
import {
  fetchProfiles,
  addProfile,
} from "../../../../store/features/profileSlice";
import { findTeamByCode } from "../../../../services/TeamService";
import { Trash2, Phone } from "lucide-react";

function ProfileList() {
  const dispatch = useDispatch();
  const profiles = useSelector((state) => state.profiles.list);
  const activeProfile = useSelector((state) => state.activeProfile.profile);

  const [showModal, setShowModal] = useState(false);
  const [selectedProfileToDelete, setSelectedProfileToDelete] = useState(null);
  const loggedUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (loggedUser) dispatch(fetchProfiles());
  }, [dispatch, loggedUser]);

  // modal usuwania
  const handleDeleteClick = (profile, e) => {
    e.stopPropagation();
    setSelectedProfileToDelete(profile);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (selectedProfileToDelete) {
      removeProfile(selectedProfileToDelete);
      dispatch(fetchProfiles());
      setShowModal(false);
      setSelectedProfileToDelete(null);
    }
  };

  // wybieranie profilu
  const handleProfileClick = (profile) => {
    dispatch(setActiveProfile(profile));
  };

  if (profiles.length === 0) {
    return <p>Brak zapisanych profili</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.tableHeader}>
        <div className={styles.headerCell}>Imie Nazwisko</div>
        <div className={styles.headerCell}>Drużyna</div>
        <div className={styles.headerCell}>Telefon</div>
        <div className={styles.headerCellAction}></div>
      </div>
      <div>
        <ul className={styles.list}>
          {profiles.map((profile, index) => {
            const team = findTeamByCode(profile.TeamCode);

            // const playerTeam = team.find((t) => t.TeamID === profile.TeamID);

            return (
              <li key={index} className={styles.item}>
                <button
                  className={`${styles.itemButton} ${
                    activeProfile?.PlayerID === profile.PlayerID
                      ? styles.active
                      : ""
                  }`}
                  onClick={() => handleProfileClick(profile)}
                >
                  <span className={`${styles.name} ${styles.textColor}`}>
                    {profile.FirstName} {profile.LastName}
                  </span>
                  <span className={`${styles.team} ${styles.textColor}`}>
                    {team ? team.Name : "Brak drużyny"}
                  </span>

                  <span className={`${styles.phone} ${styles.textColor}`}>
                    <Phone className={styles.phonesvg} />
                    {profile.Phone}
                  </span>

                  <span
                    className={`${styles.delete} ${styles.textColor}`}
                    onClick={(e) => handleDeleteClick(profile, e)}
                  >
                    <Trash2 className={styles.delete} />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <ConfirmModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmDelete}
        title="Potwierdź usunięcie profilu"
      >
        <p>
          Czy na pewno chcesz usunąć profil{" "}
          <strong>
            {selectedProfileToDelete?.FirstName}{" "}
            {selectedProfileToDelete?.LastName}
          </strong>
          ?
        </p>
      </ConfirmModal>
    </div>
  );
}

export default ProfileList;
