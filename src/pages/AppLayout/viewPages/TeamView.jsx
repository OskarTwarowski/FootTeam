import { useSelector } from "react-redux";
import styles from "./TeamView.module.css";

function TeamView() {
  const activeProfile = useSelector((state) => state.activeProfile.profile);
  const profiles = useSelector((state) => state.profiles?.list ?? " ");
  if (!activeProfile) {
    return <p>Prosze wybrać Profil by połączyć sie z druzyną</p>;
  }

  const teamPlayers = profiles.filter(
    (p) => p.TeamCode === activeProfile.TeamCode
  );

  if (teamPlayers.length === 0) {
    return <p>Brak graczy w tej drużynie.</p>;
  }

  // Trener na początku listy
  const sortedPlayers = [
    ...teamPlayers.filter((p) => p.Role === "Trener"),
    ...teamPlayers.filter((p) => p.Role !== "Trener"),
  ];

  const teamName = teamPlayers[0]?.TeamName || "Nieznana Drużyna";
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>{teamName}</h1>
        <p className={styles.teamCode}>Kod drużyny: {activeProfile.TeamCode}</p>
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
