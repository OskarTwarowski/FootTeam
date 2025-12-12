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
  X,
} from "lucide-react";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const userRole = useSelector((state) => state?.auth?.user?.Role ?? null);

  return (
    <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ""}`}>
      {/* CLOSE BUTTON ON MOBILE */}
      <button
        className={styles.closeButton}
        onClick={() => setSidebarOpen(false)}
      >
        <X size={26} />
      </button>

      <Logo />

      <nav>
        <ul>
          <li>
            <NavLink
              to="profil"
              className={({ isActive }) => (isActive ? styles.active : "")}
              onClick={() => setSidebarOpen(false)}
            >
              <UserRoundPen className={styles.marginRight} />
              Profil
            </NavLink>
          </li>

          <li>
            <NavLink
              to="druzyna"
              className={({ isActive }) => (isActive ? styles.active : "")}
              onClick={() => setSidebarOpen(false)}
            >
              <NotebookTabs className={styles.marginRight} />
              Drużyna
            </NavLink>
          </li>

          <li>
            <NavLink
              to="kalendarz"
              className={({ isActive }) => (isActive ? styles.active : "")}
              onClick={() => setSidebarOpen(false)}
            >
              <Calendar className={styles.marginRight} />
              Kalendarz
            </NavLink>
          </li>

          <li>
            <NavLink
              to="platnosci"
              className={({ isActive }) => (isActive ? styles.active : "")}
              onClick={() => setSidebarOpen(false)}
            >
              <CreditCard className={styles.marginRight} />
              Płatności
            </NavLink>
          </li>

          <li>
            <NavLink
              to="powiadomienia"
              className={({ isActive }) => (isActive ? styles.active : "")}
              onClick={() => setSidebarOpen(false)}
            >
              <Bell className={styles.marginRight} />
              Powiadomienia
            </NavLink>
          </li>

          <li>
            <NavLink
              to="ustawienia"
              className={({ isActive }) => (isActive ? styles.active : "")}
              onClick={() => setSidebarOpen(false)}
            >
              <Settings className={styles.marginRight} />
              Ustawienia
            </NavLink>
          </li>

          {userRole === "Admin" && (
            <li>
              <NavLink
                to="admin"
                className={({ isActive }) => (isActive ? styles.active : "")}
                onClick={() => setSidebarOpen(false)}
              >
                <UserStar className={styles.marginRight} />
                Panel Administratora
              </NavLink>
            </li>
          )}
        </ul>
      </nav>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} FootTeam</p>
      </footer>
    </aside>
  );
}

export default Sidebar;
