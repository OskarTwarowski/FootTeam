import { useReducer } from "react";
import Logo from "../../../components/Logo";
import styles from "./Sidebar.module.css";

const initialState = { activeTab: "druzyna" };

function reducer(state, action) {
  switch (action.type) {
    case "SET_TAB":
      return { ...state, activeTab: action.tab };
    default:
      return state;
  }
}

function Sidebar({ onTabChange }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleTabClick = (tab) => {
    dispatch({ type: "SET_TAB", tab });
    onTabChange(tab);
  };

  return (
    <aside className={styles.sidebar}>
      <Logo />

      <nav>
        <ul>
          <li
            className={state.activeTab === "druzyna" ? styles.active : ""}
            onClick={() => handleTabClick("druzyna")}
          >
            Drużyna
          </li>
          <li
            className={state.activeTab === "kalendarz" ? styles.active : ""}
            onClick={() => handleTabClick("kalendarz")}
          >
            Kalendarz
          </li>
          <li
            className={state.activeTab === "platnosci" ? styles.active : ""}
            onClick={() => handleTabClick("platnosci")}
          >
            Płatności
          </li>
          <li
            className={state.activeTab === "powiadomienia" ? styles.active : ""}
            onClick={() => handleTabClick("powiadomienia")}
          >
            Powiadomienia
          </li>
          <li
            className={state.activeTab === "ustawienia" ? styles.active : ""}
            onClick={() => handleTabClick("ustawienia")}
          >
            Ustawienia
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
