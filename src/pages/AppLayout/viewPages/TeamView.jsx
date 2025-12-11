import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { Phone } from "lucide-react";
import { updateProfile as updateProfileThunk } from "../../../store/features/profileSlice";
import { fetchTeams } from "../../../store/features/teamSlice";
import styles from "./TeamView.module.css";

function TeamView() {
  const dispatch = useDispatch();

  const activeProfile = useSelector((state) => state.activeProfile.profile);
  const profiles = useSelector((state) => state.profiles.list ?? []);
  const teams = useSelector((state) => state.teams.list);
  const userRole = useSelector((state) => state.auth.user?.Role);

  const [isOpen, setIsOpen] = useState(false);
  const [teamPlayers, setTeamPlayers] = useState([]);

  useEffect(() => {
    dispatch(fetchTeams());
  }, [dispatch]);

  useEffect(() => {
    if (!activeProfile) return setTeamPlayers([]);

    setTeamPlayers(profiles.filter((p) => p.teamID === activeProfile.teamID));
  }, [activeProfile, profiles]);

  const handleDeleteFromTeam = async (player, e) => {
    e.stopPropagation();
    await dispatch(
      updateProfileThunk({
        id: player.playerID,
        data: { teamID: null, teamCode: null },
      })
    );
  };

  // --- Widok gdy trener nie ma profilu ---
  if (userRole === "Coach" && !activeProfile) {
    return (
      <div className={styles.emptyProfileBox}>
        <h2>
          Jeśli chcesz stworzyć drużynę — skontaktuj się z nami przez ustawienia
          → kontakt
        </h2>
        <p>Jeśli masz drużynę — wybierz profil.</p>
      </div>
    );
  }

  // --- Widok gdy brak aktywnego profilu ---
  if (!activeProfile) {
    return (
      <div className={styles.emptyProfileBox}>
        <h2>Brak aktywnego profilu</h2>
        <p>Wybierz profil, aby połączyć się z drużyną.</p>
      </div>
    );
  }

  const currentTeam = teams.find(
    (team) => team.teamID === activeProfile.teamID
  );

  const sortedPlayers = [
    ...teamPlayers.filter((p) => p.userID === currentTeam?.coachId),
    ...teamPlayers.filter((p) => p.userID !== currentTeam?.coachId),
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>{currentTeam?.name || "Nieznana Drużyna"}</h1>
        <p className={styles.teamCode}>
          Kod drużyny: {currentTeam?.teamCode || "Brak kodu"}
        </p>
      </header>

      <ul className={styles.playerList}>
        {sortedPlayers.map((player, index) => (
          <li
            key={player.playerID}
            className={`${styles.playerItem} ${
              index % 2 === 1 ? styles.alternate : ""
            }`}
          >
            <div className={styles.playerInfo}>
              <span
                className={`${styles.playerName} ${
                  player.userID === currentTeam?.coachId ? styles.coach : ""
                }`}
              >
                {player.firstName} {player.lastName}
              </span>
            </div>

            <span className={styles.playerPhone}>
              {isOpen && player.userID !== currentTeam?.coachId && (
                <span
                  className={styles.playerRemove}
                  onClick={(e) => handleDeleteFromTeam(player, e)}
                >
                  ✖
                </span>
              )}
              <Phone className={styles.phonesvg} />
              {player.phoneNumber}
            </span>
          </li>
        ))}
      </ul>

      {/* Tylko trener może edytować drużynę */}
      {activeProfile && activeProfile.userID === currentTeam?.coachId && (
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
