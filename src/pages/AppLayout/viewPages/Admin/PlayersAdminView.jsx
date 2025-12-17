import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../../../store/features/profileSlice";
import styles from "./PlayersAdminView.module.css";

function PlayersAdminView() {
  const dispatch = useDispatch();

  // === PLAYERS ===
  const players = useSelector((state) => state.profiles.list ?? []);

  const [search, setSearch] = useState("");

  // === HANDLERS ===
  const handleSetCoach = async (player, e) => {
    e.stopPropagation();
    await dispatch(
      updateProfile({
        id: player.playerID,
        data: { role: "Coach" },
      })
    );
  };

  const handleRemoveRole = async (player, e) => {
    e.stopPropagation();
    await dispatch(
      updateProfile({
        id: player.playerID,
        data: { role: "Player" },
      })
    );
  };

  const handleRemoveFromTeam = async (player, e) => {
    e.stopPropagation();
    await dispatch(
      updateProfile({
        id: player.playerID,
        data: { teamID: null, teamCode: null },
      })
    );
  };

  // === SEARCH ===
  const filteredPlayers =
    search.length >= 3
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
        type="text"
        className={styles.searchInput}
        placeholder="Wpisz imię lub nazwisko (min. 3 znaki)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {search.length > 0 && search.length < 3 && (
        <p className={styles.info}>Wpisz co najmniej 3 znaki.</p>
      )}

      {filteredPlayers.length > 0 ? (
        <ul className={styles.playerList}>
          {filteredPlayers.map((player) => (
            <li key={player.playerID} className={styles.playerItem}>
              <div className={styles.playerMain}>
                <span className={styles.playerName}>
                  {player.firstName} {player.lastName}
                </span>

                <span className={styles.playerMeta}>
                  Rola: {player.role ?? "Brak"}
                </span>

                <span className={styles.playerMeta}>
                  Drużyna: {player.teamCode ?? "Brak"}
                </span>
              </div>

              <div className={styles.actions}>
                {player.role !== "Coach" && (
                  <button
                    className={styles.actionBtn}
                    onClick={(e) => handleSetCoach(player, e)}
                  >
                    Ustaw jako trenera
                  </button>
                )}

                {player.role && (
                  <button
                    className={styles.actionBtn}
                    onClick={(e) => handleRemoveRole(player, e)}
                  >
                    Usuń rolę
                  </button>
                )}

                {player.teamID && (
                  <button
                    className={`${styles.actionBtn} ${styles.danger}`}
                    onClick={(e) => handleRemoveFromTeam(player, e)}
                  >
                    Usuń z drużyny
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        search.length >= 3 && (
          <p className={styles.noResults}>
            Brak zawodników spełniających kryteria.
          </p>
        )
      )}
    </div>
  );
}

export default PlayersAdminView;
