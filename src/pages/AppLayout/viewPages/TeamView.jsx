import { useSelector, useDispatch } from "react-redux";
import { findPlayersInTeam, getTeams } from "../../../services/TeamService";
import { useState, useEffect } from "react";
import { removePlayerFromTeam } from "../../../services/ProfileService";
import {
  fetchAllProfiles,
  fetchProfiles,
  updateProfile as updateProfileThunk,
} from "../../../store/features/profileSlice";
import styles from "./TeamView.module.css";

function TeamView() {
  const dispatch = useDispatch();
  const activeProfile = useSelector((state) => state.activeProfile.profile);
  const profiles = useSelector((state) => state.profiles.list ?? []);
  const teams = getTeams();
  const userRole = useSelector((state) => state.auth.user?.Role);
  const [isOpen, setIsOpen] = useState(false);
  const [teamPlayers, setTeamPlayers] = useState([]);

  useEffect(() => {
    if (!activeProfile) {
      setTeamPlayers([]);
      return;
    }

    const currentPlayers = findPlayersInTeam(activeProfile.TeamCode);
    setTeamPlayers(currentPlayers);
  }, [activeProfile, profiles]);
  const handleDeleteFromTeam = async (player, e) => {
    e.stopPropagation();
    await dispatch(
      updateProfileThunk({ ...player, TeamID: null, TeamCode: null })
    );
    dispatch(fetchAllProfiles());
  };

  if (userRole === "Trener" && !activeProfile) {
    return (
      <div className={styles.emptyProfileBox}>
        <h2>
          Jeśli chcesz stworzyć drużyne Prosze skontaktuj sie z nami,poprzez
          ustawienia ⮕ kontakt
        </h2>
        <p>Jeśli masz drużyne ⮕ Wybierz profil, aby połączyć się z drużyną. </p>
      </div>
    );
  } else if (!activeProfile) {
    return (
      <div className={styles.emptyProfileBox}>
        <h2>Brak aktywnego profilu</h2>
        <p>Wybierz profil, aby połączyć się z drużyną.</p>
      </div>
    );
  }
  const currentTeam = teams.find(
    (team) => team.TeamID === activeProfile.TeamID
  );

  const sortedPlayers = [
    ...teamPlayers.filter((p) => p.Role === "Trener"),
    ...teamPlayers.filter((p) => p.Role !== "Trener"),
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>{currentTeam?.Name || "Nieznana Drużyna"}</h1>
        <p className={styles.teamCode}>
          Kod drużyny: {currentTeam?.TeamCode || "Brak kodu"}
        </p>
      </header>

      <ul className={styles.playerList}>
        {sortedPlayers.map((player, index) => (
          <li
            key={player.PlayerID}
            className={`${styles.playerItem} ${
              index % 2 === 1 ? styles.alternate : ""
            }`}
          >
            <div className={styles.playerInfo}>
              <span
                className={`${styles.playerName} ${
                  player.Role === "Trener" ? styles.coach : ""
                }`}
              >
                {player.FirstName} {player.LastName}
              </span>

              {isOpen && (
                <span
                  className={styles.playerRemove}
                  onClick={(e) => handleDeleteFromTeam(player, e)}
                >
                  ✖
                </span>
              )}
            </div>

            <span className={styles.playerPhone}>{player.Phone}</span>
          </li>
        ))}
      </ul>

      {activeProfile.Role === "Trener" && (
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className={styles.editTeam}
        >
          Edytuj drużynę
        </button>
      )}
    </div>
  );
}

export default TeamView;
