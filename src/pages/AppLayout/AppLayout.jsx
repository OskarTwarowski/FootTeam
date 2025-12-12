import styles from "../AppLayout/AppLayout.module.css";
import Sidebar from "../AppLayout/components/Sidebar";
import ProfileButton from "./components/ProfileButton";
import { Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Menu } from "lucide-react";

function AppLayout() {
  const lightMode = useSelector((state) => state?.settings?.lightMode ?? false);

  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`${styles.app} ${lightMode ? "light-mode" : ""}`}>
      {/* HAMBURGER BUTTON — tylko na mobile */}
      <button
        className={styles.mobileMenuButton}
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={28} />
      </button>

      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* DARK OVERLAY */}
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      <div key={location.pathname} className={styles.outletContainer}>
        <Outlet />
      </div>

      <ProfileButton />
    </div>
  );
}

export default AppLayout;
