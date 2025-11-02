import styles from "../AppLayout/AppLayout.module.css";
import Sidebar from "../AppLayout/components/Sidebar";
import ProfileButton from "./components/ProfileButton";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function AppLayout() {
  const lightMode = useSelector((state) => state.settings.lightMode);

  return (
    <div className={`${styles.app} ${lightMode ? "light-mode" : ""}`}>
      <Sidebar />
      <Outlet />
      <ProfileButton />
    </div>
  );
}

export default AppLayout;
