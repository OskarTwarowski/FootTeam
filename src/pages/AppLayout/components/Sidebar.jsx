import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import Logo from "../../../components/Logo";
import styles from "./Sidebar.module.css";
import {
  UserRoundPen,
  NotebookTabs,
  Calendar,
  CreditCard,
  Bell,
  Settings,
  UserStar,
} from "lucide-react";

function Sidebar() {
  const userRole = useSelector((state) => state.auth.user?.Role);

  return (
    <aside className={styles.sidebar}>
      <Logo />
      <nav>
        <ul>
          <li>
            <NavLink
              to="profil"
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              <UserRoundPen className={styles.marginRight} />
              Profil
            </NavLink>
          </li>

          <li>
            <NavLink
              to="druzyna"
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              <NotebookTabs className={styles.marginRight} />
              Drużyna
            </NavLink>
          </li>

          <li>
            <NavLink
              to="kalendarz"
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              <Calendar className={styles.marginRight} />
              Kalendarz
            </NavLink>
          </li>

          <li>
            <NavLink
              to="platnosci"
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              <CreditCard className={styles.marginRight} />
              Płatności
            </NavLink>
          </li>

          <li>
            <NavLink
              to="powiadomienia"
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              <Bell className={styles.marginRight} />
              Powiadomienia
            </NavLink>
          </li>

          <li>
            <NavLink
              to="ustawienia"
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              <Settings className={styles.marginRight} />
              Ustawienia
            </NavLink>
          </li>

          {/* Widoczne tylko dla administratora */}
          {userRole === "Admin" && (
            <li>
              <NavLink
                to="admin"
                className={({ isActive }) => (isActive ? styles.active : "")}
              >
                <UserStar className={styles.marginRight} />
                Panel Administratora
              </NavLink>
            </li>
          )}
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
