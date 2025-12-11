import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import styles from "./TeamView.module.css";
import { Phone } from "lucide-react";

import { fetchTeams } from "../../../store/features/teamSlice";
import { updateProfile as updateProfileThunk } from "../../../store/features/profileSlice";

import API from "../../../API/axios";

function TeamView() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const activeProfile = useSelector((state) => state.activeProfile.profile);
  const teams = useSelector((state) => state.teams.list);

  const [teamPlayers, setTeamPlayers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // === LOAD TEAMS ===
  useEffect(() => {
    dispatch(fetchTeams());
  }, [dispatch]);

  // === LOAD PLAYERS OF CURRENT TEAM ===
  useEffect(() => {
    if (!activeProfile?.teamID) {
      setTeamPlayers([]);
      return;
    }

    const loadPlayers = async () => {
      try {
        const res = await API.get(`/teams/players/${activeProfile.teamID}`);
        setTeamPlayers(res.data);
      } catch (err) {
        console.error("Błąd pobierania zawodników:", err);
      }
    };

    loadPlayers();
  }, [activeProfile]);

  // === DELETE PLAYER FROM TEAM === (Coach only)
  const handleDeleteFromTeam = async (player) => {
    try {
      await dispatch(
        updateProfileThunk({
          id: player.playerID,
          data: { teamID: null, teamCode: null },
        })
      ).unwrap();

      // odśwież po zmianach
      const res = await API.get(`/teams/players/${activeProfile.teamID}`);
      setTeamPlayers(res.data);
    } catch (err) {
      alert("Nie udało się usunąć zawodnika z drużyny");
    }
  };

  // === NO PROFILE CASES ===
  if (!activeProfile) {
    return (
      <div className={styles.emptyProfileBox}>
        <h2>Brak aktywnego profilu</h2>
        <p>Wybierz profil, aby połączyć się z drużyną.</p>
      </div>
    );
  }

  if (user?.Role === "Trener" && !activeProfile.teamID) {
    return (
      <div className={styles.emptyProfileBox}>
        <h2>Nie masz przypisanej drużyny</h2>
        <p>
          Jeśli chcesz stworzyć nową drużynę → skontaktuj się z administracją w
          zakładce Ustawienia → Kontakt
        </p>
      </div>
    );
  }

  // === FIND CURRENT TEAM ===
  const currentTeam = teams.find(
    (team) => team.teamID === activeProfile.teamID
  );

  // === SORT: Coach first ===
  const sortedPlayers = [
    ...teamPlayers.filter((p) => p.role === "Coach"),
    ...teamPlayers.filter((p) => p.role !== "Coach"),
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
                  player.role === "Coach" ? styles.coach : ""
                }`}
              >
                {player.firstName} {player.lastName}
              </span>
            </div>

            <span className={styles.playerPhone}>
              {isOpen && user?.Role === "Trener" && player.role !== "Coach" && (
                <span
                  className={styles.playerRemove}
                  onClick={() => handleDeleteFromTeam(player)}
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

      {user?.Role === "Trener" && (
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
