import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import {
  fetchTeamsApi,
  fetchTeamPlayersApi,
} from "../../../services/TeamService";
import { updateProfile as updateProfileThunk } from "../../../store/features/profileSlice";
import styles from "./TeamView.module.css";
import { Phone } from "lucide-react";

function TeamView() {
  const dispatch = useDispatch();
  const activeProfile = useSelector((state) => state.activeProfile.profile);
  const userRole = useSelector((state) => state.auth.user?.Role);

  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [editMode, setEditMode] = useState(false);

  // Ładowanie drużyny
  useEffect(() => {
    if (!activeProfile?.TeamID) return;

    fetchTeamsApi().then((teams) => {
      const found = teams.find((t) => t.teamID === activeProfile.TeamID);
      setTeam(found);
    });

    fetchTeamPlayersApi(activeProfile.TeamID).then((list) => {
      setPlayers(list);
    });
  }, [activeProfile]);

  const handleRemove = async (player) => {
    await dispatch(
      updateProfileThunk({
        id: player.playerID,
        data: { teamID: null, teamCode: null },
      })
    );
    setPlayers((prev) => prev.filter((p) => p.playerID !== player.playerID));
  };

  if (!activeProfile) {
    return (
      <div className={styles.emptyProfileBox}>
        <h2>Brak aktywnego profilu</h2>
      </div>
    );
  }

  if (!team) {
    return (
      <div className={styles.emptyProfileBox}>
        <h2>Ładowanie drużyny...</h2>
      </div>
    );
  }

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
                  player.role === "Trener" ? styles.coach : ""
                }`}
              >
                {player.firstName} {player.lastName}
              </span>
            </div>

            <span className={styles.playerPhone}>
              {editMode && player.role !== "Trener" && (
                <span
                  className={styles.playerRemove}
                  onClick={() => handleRemove(player)}
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
