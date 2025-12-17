import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllPlayers,
  updateProfile,
} from "../../../../store/features/profileSlice";
import styles from "./PlayersAdminView.module.css";

function PlayersAdminView() {
  const dispatch = useDispatch();

  const players = useSelector((state) => state.profiles.list ?? []);
  const status = useSelector((state) => state.profiles.status);

  const [search, setSearch] = useState("");

  // ✅ ADMIN → pobieramy WSZYSTKICH
  useEffect(() => {
    dispatch(fetchAllPlayers());
  }, [dispatch]);

  const filteredPlayers =
    search.length >= 3
      ? players.filter((p) =>
          `${p.FirstName ?? ""} ${p.LastName ?? ""}`
            .toLowerCase()
            .includes(search.toLowerCase())
        )
      : [];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Lista zawodników</h1>

      <input
        className={styles.searchInput}
        placeholder="Min. 3 znaki"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {status === "loading" && <p>Ładowanie...</p>}

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
