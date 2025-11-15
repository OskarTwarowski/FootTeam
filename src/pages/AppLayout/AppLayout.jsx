import styles from "../AppLayout/AppLayout.module.css";
import Sidebar from "../AppLayout/components/Sidebar";
import ProfileButton from "./components/ProfileButton";
import { Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function AppLayout() {
  const lightMode = useSelector((state) => state.settings.lightMode);
  const location = useLocation();
  return (
    <div className={`${styles.app} ${lightMode ? "light-mode" : ""}`}>
      <Sidebar />
      <div key={location.pathname} className={styles.outletContainer}>
        <Outlet />
      </div>
      <ProfileButton />
    </div>
  );
}

export default AppLayout;
