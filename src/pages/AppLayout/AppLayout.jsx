import styles from "../AppLayout/AppLayout.module.css";
import Sidebar from "../AppLayout/components/Sidebar";
import Profile from "../AppLayout/components/Profile";
import View from "../AppLayout/components/View";
import { useState } from "react";
import MainView from "./viewPages/MainView";

function AppLayout() {
  const [activeTab, setActiveTab] = useState("view");
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  return (
    <div className={styles.app}>
      <Sidebar onTabChange={handleTabChange} />
      <MainView activeTab={activeTab} />
      <Profile />
    </div>
  );
}

export default AppLayout;
