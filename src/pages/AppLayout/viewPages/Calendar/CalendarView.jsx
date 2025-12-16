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
import Loader from "../../../../components/Loader";

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

  // ✅ helper – czy aktualny profil ma prawo edycji
  const canManageTrainings =
    activeProfile?.Role === "Coach" || activeProfile?.Role === "Admin";

  // ---- Pobranie treningów ----
  useEffect(() => {
    if (activeProfile) {
      dispatch(fetchTrainings());
    }
  }, [dispatch, activeProfile]);

  // ---- Filtrowanie po drużynie ----
  const filteredTrainings = useMemo(() => {
    if (!activeProfile?.TeamID) return [];
    return trainings.filter((t) => t.teamID === activeProfile.TeamID);
  }, [trainings, activeProfile]);

  // ---- Mapowanie na eventy kalendarza ----
  const events = filteredTrainings.map((t) => ({
    TrainingID: t.trainingID,
    title: t.title || "Bez nazwy",
    start: new Date(t.startTime),
    end: new Date(t.endTime),
    Description: t.description,
    color: t.color || "#007bff",
  }));

  // ---- Custom header ----
  const CustomHeader = ({ label, onNavigate }) => (
    <div className={styles.header}>
      <button onClick={() => onNavigate("PREV")}>Poprzedni</button>
      <span className={styles.center}>{label}</span>
      <button onClick={() => onNavigate("NEXT")}>Następny</button>
    </div>
  );

  // ---- Klik w pusty slot ----
  const handleSelectSlot = (slotInfo) => {
    if (!canManageTrainings) return;
    setSelectedDate(slotInfo.start);
    setShowAddModal(true);
  };

  // ---- Klik w event ----
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  if (status === "loading") {
    return (
      <div className={styles.loaderWrapper}>
        <Loader />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Calendar
        selectable={canManageTrainings}
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
        onSelectSlot={canManageTrainings ? handleSelectSlot : undefined}
        onSelectEvent={handleSelectEvent}
      />

      {/* Modal dodawania treningu */}
      {canManageTrainings && (
        <AddTrainingModal
          show={showAddModal}
          onClose={() => setShowAddModal(false)}
          preselectedDate={selectedDate}
          teamId={activeProfile?.TeamID}
          coachId={
            activeProfile?.Role === "Coach" ? activeProfile.PlayerID : null
          }
        />
      )}

      {/* Modal szczegółów */}
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
