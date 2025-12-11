import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { fetchTrainings } from "../../../../store/features/trainingSlice";

import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import pl from "date-fns/locale/pl";

import AddTrainingModal from "../Calendar/AddTrainingModal";
import EventModal from "../Calendar/EventModal";

import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from "./CalendarView.module.css";

const locales = { pl };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: pl }),
  getDay,
  locales,
});

function CalendarView() {
  const dispatch = useDispatch();

  const { list: trainings, status } = useSelector((state) => state.training);
  const activeProfile = useSelector((state) => state.activeProfile.profile);

  const [date, setDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

  // ---- Pobranie treningów ----
  useEffect(() => {
    dispatch(fetchTrainings());
  }, [dispatch, activeProfile]);

  // ---- Filtrowanie po drużynie ----
  const filteredTrainings = useMemo(() => {
    if (!activeProfile || !activeProfile.TeamID) return [];
    return trainings.filter((t) => t.teamID === activeProfile.TeamID);
  }, [trainings, activeProfile]);

  // ---- Format na eventy do kalendarza ----
  const events = filteredTrainings.map((t) => ({
    TrainingID: t.trainingID,
    title: t.title || "Bez nazwy",
    start: new Date(t.startTime),
    end: new Date(t.endTime),
    Description: t.description,
    color: t.color || "#007bff",
  }));

  // ---- Customowy nagłówek ----
  const CustomHeader = ({ label, onNavigate }) => (
    <div className={styles.header}>
      <button onClick={() => onNavigate("PREV")}>Poprzedni</button>
      <span className={styles.center}>{label}</span>
      <button onClick={() => onNavigate("NEXT")}>Następny</button>
    </div>
  );

  // ---- Klik na pusty slot → dodanie treningu ----
  const handleSelectSlot = (slotInfo) => {
    if (loggedUser?.Role === "Coach" || loggedUser?.Role === "Admin") {
      setSelectedDate(slotInfo.start);
      setShowAddModal(true);
    }
  };

  // ---- Kliknięcie na istniejący trening ----
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  if (status === "loading") return <p>Ładowanie treningów...</p>;

  return (
    <div className={styles.container}>
      <Calendar
        selectable
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "70vh" }}
        defaultView="month"
        className={styles.calendarContainer}
        eventPropGetter={(event) => ({
          style: { backgroundColor: event.color, color: "#ececec" },
        })}
        date={date}
        onNavigate={(newDate) => setDate(newDate)}
        components={{ toolbar: CustomHeader }}
        onSelectSlot={
          loggedUser?.Role === "Coach" || loggedUser?.Role === "Admin"
            ? handleSelectSlot
            : undefined
        }
        onSelectEvent={handleSelectEvent}
      />

      {/* Modal dodawania treningu */}
      <AddTrainingModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        preselectedDate={selectedDate}
        teamId={activeProfile?.TeamID}
        coachId={loggedUser?.Role === "Coach" ? activeProfile?.PlayerID : null}
      />

      {/* Modal szczegółów treningu */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}

export default CalendarView;
