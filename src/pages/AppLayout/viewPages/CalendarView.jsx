import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrainings } from "../../../store/features/trainingSlice";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import pl from "date-fns/locale/pl";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from "./CalendarView.module.css";
import { useState, useEffect } from "react";

const locales = { pl: pl };
//custom pl dodany ponieważ localny pobrany PL ma błędne końcówki miesięcy
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
// sztuczne eventy

function CalendarView() {
  const dispatch = useDispatch();
  const { list: trainings, status } = useSelector((state) => state.training);
  const [date, setDate] = useState(new Date());
  useEffect(() => {
    dispatch(fetchTrainings());
  }, [dispatch]);
  console.log("trainings:", trainings);
  const events = trainings.map((t) => ({
    title: t.title || t.Title || "Bez nazwy",
    start: new Date(t.start || t.StartTime),
    end: new Date(t.end || t.EndTime),
    color: t.color || "#007bff",
  }));

  const CustomHeader = ({ label, onNavigate }) => (
    <div className={styles.header}>
      <button onClick={() => onNavigate("PREV")}>Poprzedni</button>
      <span className={styles.center}>{label}</span>
      <button onClick={() => onNavigate("NEXT")}>Następny</button>
    </div>
  );
  if (status === "loading") return <p>Ładowanie treningów...</p>;
  return (
    <div className={styles.container}>
      <Calendar
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
      />
    </div>
  );
}

export default CalendarView;
