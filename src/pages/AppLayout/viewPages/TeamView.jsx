import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import styles from "./TeamView.module.css";
import { Phone } from "lucide-react";

import { fetchTeams } from "../../../store/features/teamSlice";
import { updateProfile as updateProfileThunk } from "../../../store/features/profileSlice";

import API from "../../../API/axios";
import Loader from "../../../components/Loader";

function TeamView() {
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.teams);
  const teams = useSelector((state) => state.teams.list);

  const user = useSelector((state) => state.auth.user);
  const activeProfile = useSelector((state) => state.activeProfile.profile);

  const [teamPlayers, setTeamPlayers] = useState([]);
  const [playersLoading, setPlayersLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // ===== ROLE LOGIC =====
  const isAdmin = user?.Role === "Admin";
  const isCoach = activeProfile?.role === "Coach";
  const canManageTeam = isAdmin || isCoach;

  // ===== FETCH TEAMS =====
  useEffect(() => {
    dispatch(fetchTeams());
  }, [dispatch]);

  // ===== FETCH PLAYERS =====
  useEffect(() => {
    if (!activeProfile?.teamID) {
      setTeamPlayers([]);
      return;
    }

    const loadPlayers = async () => {
      try {
        setPlayersLoading(true);
        const res = await API.get(`/teams/players/${activeProfile.teamID}`);
        setTeamPlayers(res.data);
      } catch (err) {
        console.error("Błąd pobierania zawodników:", err);
      } finally {
        setPlayersLoading(false);
      }
    };

    loadPlayers();
  }, [activeProfile?.teamID]);

  // ===== REMOVE PLAYER =====
  const handleDeleteFromTeam = async (player) => {
    if (!window.confirm("Usunąć zawodnika z drużyny?")) return;

    try {
      await dispatch(
        updateProfileThunk({
          id: player.playerID,
          data: { teamID: null, teamCode: null },
        })
      ).unwrap();

      const res = await API.get(`/teams/players/${activeProfile.teamID}`);
      setTeamPlayers(res.data);
    } catch {
      alert("Nie udało się usunąć zawodnika z drużyny");
    }
  };

  // ===== LOADING =====
  if (loading) return <Loader />;

  // ===== NO PROFILE =====
  if (!activeProfile) {
    return (
      <div className={styles.emptyProfileBox}>
        <h2>Brak aktywnego profilu</h2>
        <p>Wybierz profil, aby zobaczyć drużynę.</p>
      </div>
    );
  }

  // ===== FIND TEAM =====
  const currentTeam = teams.find(
    (team) => team.teamID === activeProfile.teamID
  );

  // ===== SORT PLAYERS (Coach first) =====
  const sortedPlayers = [
    ...teamPlayers.filter((p) => p.role === "Coach"),
    ...teamPlayers.filter((p) => p.role !== "Coach"),
  ];

  return (
    <div className={styles.container}>
      {/* ===== HEADER ===== */}
      <header className={styles.header}>
        <h1>{currentTeam?.name || "Nieznana drużyna"}</h1>
        <p className={styles.teamCode}>
          Kod drużyny: {currentTeam?.teamCode || "—"}
        </p>
      </header>

      {/* ===== PLAYERS LIST ===== */}
      <ul className={styles.playerList}>
        {playersLoading ? (
          <div className={styles.loaderWrapper}>
            <Loader />
          </div>
        ) : sortedPlayers.length === 0 ? (
          <p className={styles.noPlayers}>Brak zawodników w drużynie</p>
        ) : (
          sortedPlayers.map((player, index) => {
            const canRemovePlayer =
              editMode && canManageTeam && player.role !== "Coach";

            return (
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
                  {canRemovePlayer && (
                    <span
                      className={styles.playerRemove}
                      onClick={() => handleDeleteFromTeam(player)}
                      title="Usuń z drużyny"
                    >
                      ✖
                    </span>
                  )}
                  <Phone className={styles.phonesvg} />
                  {player.phoneNumber}
                </span>
              </li>
            );
          })
        )}
      </ul>

      {/* ===== EDIT BUTTON ===== */}
      {canManageTeam && (
        <button
          onClick={() => setEditMode((prev) => !prev)}
          className={styles.editTeam}
        >
          {editMode ? "Zakończ edycję" : "Edytuj drużynę"}
        </button>
      )}
    </div>
  );
}

export default TeamView;
