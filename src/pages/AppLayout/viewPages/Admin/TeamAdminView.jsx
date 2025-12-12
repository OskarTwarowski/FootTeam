import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTeams,
  createTeam,
  deleteTeam,
} from "../../../../store/features/teamSlice";
import styles from "./TeamAdminView.module.css";

export default function TeamAdminView() {
  const dispatch = useDispatch();
  const { list: teams, loading } = useSelector((state) => state.teams);
  const loggedUser = useSelector((state) => state.auth.user);

  const [searchTerm, setSearchTerm] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");

  useEffect(() => {
    dispatch(fetchTeams());
  }, [dispatch]);

  // FILTROWANIE
  useEffect(() => {
    if (searchTerm.length >= 3) {
      const lower = searchTerm.toLowerCase();
      setFiltered(teams.filter((t) => t.name.toLowerCase().includes(lower)));
    } else {
      setFiltered([]);
    }
  }, [searchTerm, teams]);

  // TWORZENIE DRUŻYNY
  const handleCreateTeam = (e) => {
    e.preventDefault();

    if (!newTeamName.trim()) return;

    dispatch(
      createTeam({
        name: newTeamName.trim(),
        coachId: loggedUser?.userId, // wymagane przez backend
      })
    );

    setNewTeamName("");
    setIsCreating(false);
  };

  // USUWANIE
  const handleDeleteTeam = (teamId) => {
    if (window.confirm("Czy na pewno chcesz usunąć tę drużynę?")) {
      dispatch(deleteTeam(teamId));
    }
  };

  return (
    <div className={styles.container}>
      <h1>Lista Drużyn</h1>

      <input
        type="text"
        placeholder="Wpisz nazwę drużyny (min. 3 litery)"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />

      {loading && <p>Wczytywanie drużyn...</p>}

      {filtered.length > 0 && (
        <ul className={styles.teamList}>
          {filtered.map((team) => (
            <li key={team.teamID} className={styles.teamItem}>
              <strong>{team.name}</strong>

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

      {searchTerm.length >= 3 && filtered.length === 0 && (
        <p>Nie znaleziono drużyn.</p>
      )}

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
          />

          <div className={styles.formButtons}>
            <button type="submit">Zapisz</button>
            <button type="button" onClick={() => setIsCreating(false)}>
              Anuluj
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
