import { useEffect, useState } from "react";
import styles from "./ProfileList.module.css";
import { getProfiles } from "../../../../services/ProfileService";

function ProfileList() {
  const [profile, setProfile] = useState([]);
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

  if (profile.length === 0) {
    return <p>Brak zapisanych profili</p>;
  }
  return (
    <div>
      <ul className={styles.list}>
        {profile.map((profile, index) => (
          <li key={index} className={styles.item}>
            <div>
              <strong>
                {profile.FirstName} {profile.LastName} {profile.Phone}
              </strong>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProfileList;
