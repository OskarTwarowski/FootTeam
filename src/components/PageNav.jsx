import { NavLink } from "react-router-dom";
import styles from "./PageNav.module.css";
import Logo from "./Logo";
function PageNav() {
  return (
    <nav className={styles.nav}>
      <Logo />
      <ul>
        <li>
          <NavLink to="/o-nas">O nas</NavLink>
        </li>
        <li>
          <NavLink to="/rejestracja">Rejestracja</NavLink>
        </li>
        <li>
          <NavLink to="/logowanie" className={styles.ctaLink}>
            logowanie
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default PageNav;
