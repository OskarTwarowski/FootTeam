import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../../../store/features/profileSlice";
import styles from "./PlayersAdminView.module.css";

function PlayersAdminView() {
  const dispatch = useDispatch();
  const profiles = useSelector((state) => state.profiles.list ?? []);
  const [search, setSearch] = useState("");
  useEffect(() => {}, [dispatch]);
  const handleDeleteFromTeam = async (player, e) => {
    e.stopPropagation();
    await dispatch(updateProfile({ ...player, TeamID: null, TeamCode: null }));
  };
  const handleDeleteRole = async (player, e) => {
    e.stopPropagation();
    await dispatch(updateProfile({ ...player, Role: null }));
  };
  const handleRoleTrener = async (player, e) => {
    e.stopPropagation();
    await dispatch(updateProfile({ ...player, Role: "Coach" }));
  };
  const filteredProfiles =
    search.length >= 3
      ? profiles.filter((p) => {
          const fullName = `${p.FirstName} ${p.LastName}`.toLowerCase();
          return fullName.includes(search.toLowerCase());
        })
      : [];
  return (
    <div className={styles.container}>
      <h1>Lista Graczy</h1>
      <input
        type="Text"
        className={styles.searchInput}
        placeholder="dane zawodnika"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {search.length > 0 && search.length < 3 && (
        <p className={styles.info}>Wpisz co najmniej 3 litery, aby wyszukać.</p>
      )}
      {filteredProfiles.length > 0 ? (
        <ul className={styles.playerList}>
          {filteredProfiles.map((player) => (
            <li key={player.PlayerID} className={styles.playerItem}>
              <span>
                {player.FirstName} {player.LastName}
              </span>
              <span
                className={styles.playerRemove}
                onClick={(e) => handleRoleTrener(player, e)}
              >
                Przypisz jako Trenera
              </span>
              <span
                className={styles.playerRemove}
                onClick={(e) => handleDeleteRole(player, e)}
              >
                Usuń Role: {player.Role}
              </span>
              <span
                className={styles.playerRemove}
                onClick={(e) => handleDeleteFromTeam(player, e)}
              >
                ✖ Usuń z drużyny : {player.TeamCode || "Brak drużyny"}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        search.length >= 3 && (
          <p className={styles.noResults}>
            Brak graczy spełniających kryteria.
          </p>
        )
      )}
    </div>
  );
}

export default PlayersAdminView;
