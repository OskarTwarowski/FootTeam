import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./ProfileList.module.css";
import {
  getProfiles,
  removeProfile,
} from "../../../../services/ProfileService";
import ConfirmModal from "../../../../components/ConfirmModal";
import { setActiveProfile } from "../../../../store/features/activeProfileSlice";

function ProfileList() {
  const [profiles, setProfiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProfileToDelete, setSelectedProfileToDelete] = useState(null);

  const dispatch = useDispatch();
  const activeProfile = useSelector((state) => state.activeProfile.profile);

  const loadProfiles = () => setProfiles(getProfiles());

  useEffect(() => {
    loadProfiles();
    const handleStorageChange = (e) => {
      if (e.key === "Profiles" || !e.key) loadProfiles();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // modal usuwania
  const handleDeleteClick = (profile, e) => {
    e.stopPropagation();
    setSelectedProfileToDelete(profile);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (selectedProfileToDelete) {
      removeProfile(selectedProfileToDelete);
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
    <div>
      <ul className={styles.list}>
        {profiles.map((profile, index) => (
          <li key={index} className={styles.item}>
            <button
              className={`${styles.itemButton} ${
                activeProfile?.PlayerID === profile.PlayerID
                  ? styles.active
                  : ""
              }`}
              onClick={() => handleProfileClick(profile)}
            >
              <span className={styles.name}>
                {profile.FirstName} {profile.LastName}
              </span>
              <span className={styles.phone}>{profile.Phone}</span>
              <span
                className={styles.delete}
                onClick={(e) => handleDeleteClick(profile, e)}
              >
                ✖
              </span>
            </button>
          </li>
        ))}
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
