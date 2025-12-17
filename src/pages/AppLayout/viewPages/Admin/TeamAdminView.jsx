import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTeams,
  createTeam,
  deleteTeam,
} from "../../../../store/features/teamSlice";
import styles from "./TeamAdminView.module.css";
import Loader from "../../../../components/Loader";

function TeamAdminView() {
  const dispatch = useDispatch();

  const { list: teams, loading } = useSelector((state) => state.teams);
  const user = useSelector((state) => state.auth.user);

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");

  // ===== FETCH TEAMS =====
  useEffect(() => {
    dispatch(fetchTeams());
  }, [dispatch]);

  // ===== FILTERED TEAMS =====
  const filteredTeams = useMemo(() => {
    if (searchTerm.length < 3) return [];
    const lower = searchTerm.toLowerCase();
    return teams.filter((t) => t.name.toLowerCase().includes(lower));
  }, [teams, searchTerm]);

  // ===== CREATE TEAM =====
  const handleCreateTeam = async (e) => {
    e.preventDefault();

    if (!newTeamName.trim()) return;

    try {
      await dispatch(
        createTeam({
          name: newTeamName.trim(),
          coachId: null, // ❗ admin tworzy drużynę BEZ coacha
        })
      ).unwrap();

      setNewTeamName("");
      setIsCreating(false);
      dispatch(fetchTeams());
    } catch {
      alert("Nie udało się utworzyć drużyny.");
    }
  };

  // ===== DELETE TEAM =====
  const handleDeleteTeam = async (teamId) => {
    if (!window.confirm("Czy na pewno chcesz usunąć tę drużynę?")) return;

    try {
      await dispatch(deleteTeam(teamId)).unwrap();
      dispatch(fetchTeams());
    } catch {
      alert("Nie udało się usunąć drużyny.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Zarządzanie drużynami</h1>

      {/* ===== SEARCH ===== */}
      <input
        type="text"
        placeholder="Wpisz nazwę drużyny (min. 3 znaki)"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />

      {/* ===== LOADING ===== */}
      {loading && (
        <div className={styles.loaderWrapper}>
          <Loader />
        </div>
      )}

      {/* ===== LIST ===== */}
      {filteredTeams.length > 0 && (
        <ul className={styles.teamList}>
          {filteredTeams.map((team) => (
            <li key={team.teamID} className={styles.teamItem}>
              <div className={styles.teamInfo}>
                <strong className={styles.teamName}>{team.name}</strong>
                <span className={styles.teamCode}>Kod: {team.teamCode}</span>
              </div>

              <button
                className={styles.deleteButton}
                onClick={() => handleDeleteTeam(team.teamID)}
              >
                🗑 Usuń
              </button>
            </li>
          ))}
        </ul>
      )}

      {searchTerm.length >= 3 && filteredTeams.length === 0 && (
        <p className={styles.noResults}>Nie znaleziono drużyn.</p>
      )}

      {/* ===== CREATE ===== */}
      {!isCreating ? (
        <button
          className={styles.createButton}
          onClick={() => setIsCreating(true)}
        >
          ➕ Utwórz nową drużynę
        </button>
      ) : (
        <form onSubmit={handleCreateTeam} className={styles.form}>
          <input
            type="text"
            placeholder="Nazwa drużyny"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            required
            className={styles.formInput}
          />

          <div className={styles.formButtons}>
            <button type="submit" className={styles.saveButton}>
              Zapisz
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => {
                setIsCreating(false);
                setNewTeamName("");
              }}
            >
              Anuluj
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default TeamAdminView;
