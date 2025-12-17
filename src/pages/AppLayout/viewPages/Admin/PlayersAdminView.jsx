import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPlayers } from "../../../../store/features/profileSlice";
import styles from "./PlayersAdminView.module.css";

function PlayersAdminView() {
  const dispatch = useDispatch();

  const rawPlayers = useSelector((state) => state.profiles.list ?? []);
  const status = useSelector((state) => state.profiles.status);

  const [search, setSearch] = useState("");

  // === FETCH ALL PLAYERS (ADMIN) ===
  useEffect(() => {
    dispatch(fetchAllPlayers());
  }, [dispatch]);

  // === NORMALIZACJA (PascalCase → camelCase) ===
  const players = useMemo(() => {
    return rawPlayers.map((p) => ({
      playerID: p.playerID ?? p.PlayerID,
      firstName: p.firstName ?? p.FirstName ?? "",
      lastName: p.lastName ?? p.LastName ?? "",
      role: p.role ?? p.Role ?? null,
      teamID: p.teamID ?? p.TeamID ?? null,
      teamCode: p.teamCode ?? p.TeamCode ?? null,
    }));
  }, [rawPlayers]);

  // === SEARCH ===
  const filteredPlayers =
    search.trim().length >= 3
      ? players.filter((p) =>
          `${p.firstName} ${p.lastName}`
            .toLowerCase()
            .includes(search.toLowerCase())
        )
      : [];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Lista zawodników</h1>

      <input
        className={styles.searchInput}
        placeholder="Wpisz min. 3 znaki"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {status === "loading" && <p>Ładowanie zawodników…</p>}

      {filteredPlayers.length > 0 ? (
        <ul className={styles.playerList}>
          {filteredPlayers.map((p) => (
            <li key={p.playerID} className={styles.playerItem}>
              <strong>
                {p.firstName} {p.lastName}
              </strong>

              <span>Rola: {p.role ?? "Brak"}</span>
              <span>Drużyna: {p.teamCode ?? "Brak"}</span>
            </li>
          ))}
        </ul>
      ) : (
        search.length >= 3 &&
        status === "succeeded" && (
          <p className={styles.noResults}>Brak wyników</p>
        )
      )}
    </div>
  );
}

export default PlayersAdminView;
