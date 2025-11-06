import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrainings } from "../../../../store/features/trainingSlice";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import pl from "date-fns/locale/pl";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from "./CalendarView.module.css";
import { useState, useEffect, useMemo } from "react";
import AddTrainingModal from "../Calendar/AddTrainingModal";
import EventModal from "../Calendar/EventModal";

const locales = { pl: pl };

const customPl = {
  ...pl,
  localize: {
    ...pl.localize,
    month: (n) =>
      [
        "Styczeń",
        "Luty",
        "Marzec",
        "Kwiecień",
        "Maj",
        "Czerwiec",
        "Lipiec",
        "Sierpień",
        "Wrzesień",
        "Październik",
        "Listopad",
        "Grudzień",
      ][n],
  },
};

const localizer = dateFnsLocalizer({
  format: (date, formatStr, options) =>
    format(date, formatStr, { ...options, locale: customPl }),
  parse,
  startOfWeek,
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

  useEffect(() => {
    dispatch(fetchTrainings());
  }, [dispatch, activeProfile]);

  const filteredTrainings = useMemo(() => {
    if (!activeProfile || !activeProfile.TeamID) return [];
    return trainings.filter(
      (t) => (t.TeamID || t.teamID) === activeProfile.TeamID
    );
  }, [trainings, activeProfile]);

  const events = filteredTrainings.map((t) => ({
    title: t.Title || "Bez nazwy",
    start: new Date(t.StartTime),
    end: new Date(t.EndTime),
    Description: t.Description,
    color: t.color || "#007bff",
  }));

  const CustomHeader = ({ label, onNavigate }) => (
    <div className={styles.header}>
      <button onClick={() => onNavigate("PREV")}>Poprzedni</button>
      <span className={styles.center}>{label}</span>
      <button onClick={() => onNavigate("NEXT")}>Następny</button>
    </div>
  );

  // 👇 Kliknięcie w pustą datę
  const handleSelectSlot = (slotInfo) => {
    if (loggedUser?.Role === "Trener" || loggedUser?.Role === "Admin") {
      setSelectedDate(slotInfo.start); // zapisujemy klikniętą datę
      setShowAddModal(true);
    }
  };

  if (status === "loading") return <p>Ładowanie treningów...</p>;
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };
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
          style: {
            backgroundColor: event.color,
            color: "#ececec",
          },
        })}
        date={date}
        onNavigate={(newDate) => setDate(newDate)}
        components={{
          toolbar: CustomHeader,
        }}
        onSelectSlot={
          activeProfile?.Role === "Trener" || activeProfile?.Role === "Admin"
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
      />
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
