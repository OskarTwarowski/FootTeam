import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { Phone } from "lucide-react";

import { updateProfile as updateProfileThunk } from "../../../store/features/profileSlice";
import { getTeams, findPlayersInTeam } from "../../../services/TeamService";

import styles from "./TeamView.module.css";

function TeamView() {
  const dispatch = useDispatch();

  const activeProfile = useSelector((state) => state.activeProfile.profile);
  const profiles = useSelector((state) => state.profiles.list ?? []);
  const userRole = useSelector((state) => state.auth.user?.Role);

  const teams = getTeams();

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
  };

  // ---- Widok gdy trener nie ma profilu ----
  if (userRole === "Trener" && !activeProfile) {
    return (
      <div className={styles.emptyProfileBox}>
        <h2>
          Jeśli chcesz stworzyć drużynę — skontaktuj się z nami przez ustawienia
          → kontakt
        </h2>
        <p>Jeśli masz drużynę → wybierz profil, aby połączyć się z drużyną.</p>
      </div>
    );
  }

  // ---- Widok gdy brak aktywnego profilu ----
  if (!activeProfile) {
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
    ...teamPlayers.filter((p) => p.UserID === currentTeam?.CoachId),
    ...teamPlayers.filter((p) => p.UserID !== currentTeam?.CoachId),
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
                  player.UserID === currentTeam?.CoachId ? styles.coach : ""
                }`}
              >
                {player.FirstName} {player.LastName}
              </span>
            </div>

            <span className={styles.playerPhone}>
              {isOpen && player.UserID !== currentTeam?.CoachId && (
                <span
                  className={styles.playerRemove}
                  onClick={(e) => handleDeleteFromTeam(player, e)}
                >
                  ✖
                </span>
              )}
              <Phone className={styles.phonesvg} />
              {player.PhoneNumber || player.Phone}
            </span>
          </li>
        ))}
      </ul>

      {/* Przycisk edycji drużyny tylko dla trenera */}
      {activeProfile && activeProfile.UserID === currentTeam?.CoachId && (
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
