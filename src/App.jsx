import { BrowserRouter, Route, Routes } from "react-router-dom";
import About from "./pages/about";
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import Register from "./pages/Register";
import PageNotFound from "./pages/PageNotFound";
import AppLayout from "./pages/AppLayout/AppLayout";
import TeamView from "./pages/AppLayout/viewPages/TeamView";
import CalendarView from "./pages/AppLayout/viewPages/CalendarView";
import PaymentsView from "./pages/AppLayout/viewPages/PaymentsView";
import NotificationView from "./pages/AppLayout/viewPages/NotificationView";
import SettingsView from "./pages/AppLayout/viewPages/SettingsView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="o-nas" element={<About />} />
        <Route path="logowanie" element={<Login />} />
        <Route path="rejestracja" element={<Register />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="app" element={<AppLayout />}>
          <Route index element={<TeamView />} />
          <Route path="druzyna" element={<TeamView />} />
          <Route path="kalendarz" element={<CalendarView />} />
          <Route path="platnosci" element={<PaymentsView />} />
          <Route path="powiadomienia" element={<NotificationView />} />
          <Route path="ustawienia" element={<SettingsView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
