import { useSelector } from "react-redux";
import styles from "./TeamView.module.css";
import { getTeams } from "../../../services/TeamService";

function TeamView() {
  const activeProfile = useSelector((state) => state.activeProfile.profile);
  const profiles = useSelector((state) => state.profiles?.list ?? []);
  const userRole = useSelector((state) => state.auth.user?.Role);
  const teams = getTeams();

  if (userRole === "Trener" && !activeProfile) {
    return (
      <div className={styles.emptyProfileBox}>
        <h2>
          Jeśli chcesz stworzyć drużyne Prosze skontaktuj sie z nami,poprzez
          ustawienia ⮕ kontakt
        </h2>
        <p>Jeśli masz drużyne ⮕ Wybierz profil, aby połączyć się z drużyną. </p>
      </div>
    );
  } else if (!activeProfile) {
    return (
      <div className={styles.emptyProfileBox}>
        <h2>Brak aktywnego profilu</h2>
        <p>Wybierz profil, aby połączyć się z drużyną.</p>
      </div>
    );
  }

  const currentTeam = teams.find(
    (team) => team.TeamID === activeProfile.TeamID
  );

  const teamPlayers = profiles.filter((p) => p.TeamID === activeProfile.TeamID);

  if (teamPlayers.length === 0) {
    return <p>Brak graczy w tej drużynie.</p>;
  }

  const sortedPlayers = [
    ...teamPlayers.filter((p) => p.Role === "Trener"),
    ...teamPlayers.filter((p) => p.Role !== "Trener"),
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>{currentTeam?.Name || "Nieznana Drużyna"}</h1>
        <p className={styles.teamCode}>
          Kod drużyny: {currentTeam?.TeamCode || "Brak kodu"}
        </p>
      </header>

      <ul className={styles.playerList}>
        {sortedPlayers.map((player, index) => (
          <li
            key={player.PlayerID}
            className={`${styles.playerItem} ${
              index % 2 === 1 ? styles.alternate : ""
            }`}
          >
            <span
              className={`${styles.playerName} ${
                player.Role === "Trener" ? styles.coach : ""
              }`}
            >
              {player.FirstName} {player.LastName}
            </span>
            <span className={styles.playerPhone}>{player.Phone}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TeamView;
