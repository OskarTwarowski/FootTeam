import styles from "../AppLayout/AppLayout.module.css";
import Sidebar from "../AppLayout/components/Sidebar";
import Profile from "../AppLayout/components/Profile";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function AppLayout() {
  const lightMode = useSelector((state) => state.settings.lightMode);
  const largeFont = useSelector((state) => state.settings.fontSize);
  return (
    <div className={`${styles.app} ${lightMode ? "light-mode" : ""}`}>
      <Sidebar />
      <Outlet />
      <Profile />
    </div>
  );
}

export default AppLayout;
