import styles from "../AppLayout/AppLayout.module.css";
import Sidebar from "../AppLayout/components/Sidebar";
import Profile from "../AppLayout/components/Profile";
import View from "../AppLayout/components/View";

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
