import { BrowserRouter, Route, Routes } from "react-router-dom";
import About from "./pages/about";
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import Register from "./pages/Register";
import PageNotFound from "./pages/PageNotFound";
import AppLayout from "./pages/AppLayout/AppLayout";
import TeamView from "./pages/AppLayout/viewPages/TeamView";
import CalendarView from "./pages/AppLayout/viewPages/Calendar/CalendarView";
import PaymentsView from "./pages/AppLayout/viewPages/PaymentsView";
import NotificationView from "./pages/AppLayout/viewPages/Notification/NotificationView";
import SettingsView from "./pages/AppLayout/viewPages/SettingsView";
import ProfileView from "./pages/AppLayout/viewPages/Profile/ProfileView";
import ProfileCreateForm from "./pages/AppLayout/viewPages/Profile/ProfileCreateForm";
import "bootstrap/dist/css/bootstrap.min.css";
import ProfileEditButton from "./pages/AppLayout/viewPages/Profile/ProfileEditButton";

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
          <Route index element={<ProfileView />} />
          <Route path="profil" element={<ProfileView />}>
            <Route path="dodaj-profil" element={<ProfileCreateForm />} />
            <Route path="edytuj-profil" element={<ProfileEditButton />} />
          </Route>
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
