import styles from "../pages/AppLayout.module.css";
import Sidebar from "../components/Sidebar";
import Profile from "../components/Profile";
import View from "../components/View";

function AppLayout() {
  return (
    <div className={styles.app}>
      <Sidebar />
      <View />
      <Profile />
    </div>
  );
}

export default AppLayout;
