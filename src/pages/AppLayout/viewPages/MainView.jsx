import TeamView from "../viewPages/TeamView";
import CalendarView from "../viewPages/CalendarView";
import PaymentsView from "../viewPages/PaymentsView";
import NotificationView from "../viewPages/NotificationView";
import SettingsView from "../viewPages/SettingsView";

function MainView({ activeTab }) {
  switch (activeTab) {
    case "druzyna":
      return <TeamView />;
    case "kalendarz":
      return <CalendarView />;
    case "platnosci":
      return <PaymentsView />;
    case "powiadomienia":
      return <NotificationView />;
    case "ustawienia":
      return <SettingsView />;
    default:
      return <TeamView />;
  }
}

export default MainView;
