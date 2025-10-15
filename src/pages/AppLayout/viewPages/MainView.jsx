import TeamView from "../viewPages/TeamView";
import CalendarView from "../pages/CalendarView";
import PaymentsView from "../pages/PaymentsView";
import NotificationsView from "../pages/NotificationsView";
import SettingsView from "../pages/SettingsView";

function MainView({ activeTab }) {
  switch (activeTab) {
    case "druzyna":
      return <TeamView />;
    case "kalendarz":
      return <CalendarView />;
    case "platnosci":
      return <PaymentsView />;
    case "powiadomienia":
      return <NotificationsView />;
    case "ustawienia":
      return <SettingsView />;
    default:
      return <TeamView />;
  }
}

export default MainView;
