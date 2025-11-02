import { NavLink } from "react-router-dom";
import Logo from "../../../components/Logo";
import styles from "./Sidebar.module.css";

function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <Logo />

      <nav>
        <ul>
          <li>
            <NavLink
              to="profil"
              className={({ isActive }) => (isActive ? styles.active : " ")}
            >
              Profil
            </NavLink>
          </li>
          <li>
            <NavLink
              to="druzyna"
              className={({ isActive }) => (isActive ? styles.active : " ")}
            >
              Drużyna
            </NavLink>
          </li>
          <li>
            <NavLink
              to="kalendarz"
              className={({ isActive }) => (isActive ? styles.active : " ")}
            >
              Kalendarz
            </NavLink>
          </li>
          <li>
            <NavLink
              to="platnosci"
              className={({ isActive }) => (isActive ? styles.active : " ")}
            >
              Płatności
            </NavLink>
          </li>
          <li>
            <NavLink
              to="powiadomienia"
              className={({ isActive }) => (isActive ? styles.active : " ")}
            >
              Powiadomienia
            </NavLink>
          </li>
          <li>
            <NavLink
              to="ustawienia"
              className={({ isActive }) => (isActive ? styles.active : " ")}
            >
              Ustawienia
            </NavLink>
          </li>
        </ul>
      </nav>

      <footer className={styles.footer}>
        <p className={styles.copyright}>
          &copy; {new Date().getFullYear()} FootTeam
        </p>
      </footer>
    </aside>
  );
}

export default Sidebar;
