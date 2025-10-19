import styles from "../AppLayout/AppLayout.module.css";
import Sidebar from "../AppLayout/components/Sidebar";
import Profile from "../AppLayout/components/Profile";
import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <div className={styles.app}>
      <Sidebar />
      <Outlet />
      <Profile />
    </div>
  );
}

export default AppLayout;
