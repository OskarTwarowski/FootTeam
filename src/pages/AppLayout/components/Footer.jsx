import { FaGithub } from "react-icons/fa";
import styles from "./Footer.module.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.text}>
        © {new Date().getFullYear()} <strong>FootTeam™</strong>. Wszelkie prawa
        zastrzeżone.
      </p>

      <div className={styles.links}>
        <a
          href="https://github.com/OskarTwarowski/FootTeam"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.github}
        >
          <FaGithub /> <span>GitHub</span>
        </a>
      </div>
    </footer>
  );
}

export default Footer;
