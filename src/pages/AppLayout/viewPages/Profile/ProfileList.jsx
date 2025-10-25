import { useEffect, useState } from "react";
import styles from "./ProfileList.module.css";
import {
  getProfiles,
  removeProfile,
} from "../../../../services/ProfileService";
import ConfirmModal from "../../../../components/ConfirmModal";

function ProfileList() {
  const [profile, setProfile] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const loadProfiles = () => {
    setProfile(getProfiles());
  };
  useEffect(() => {
    loadProfiles();
    const handleStorageChange = (e) => {
      if (e.key === "Profiles" || !e.key) loadProfiles();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleDeleteClick = (profile, e) => {
    e.stopPropagation();
    setSelectedProfile(profile);
    setShowModal(true);
  };
  const confirmDelete = () => {
    if (selectedProfile) {
      removeProfile(selectedProfile);
      setShowModal(false);
      setSelectedProfile(null);
    }
  };
  if (profile.length === 0) {
    return <p>Brak zapisanych profili</p>;
  }
  return (
    <div>
      <ul className={styles.list}>
        {profile.map((profile, index) => (
          <li key={index} className={styles.item}>
            <button className={styles.itemButton}>
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
            {selectedProfile?.FirstName} {selectedProfile?.LastName}
          </strong>
          ?
        </p>
      </ConfirmModal>
    </div>
  );
}

export default ProfileList;
