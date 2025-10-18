import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import pl from "date-fns/locale/pl";
import "react-big-calendar/lib/css/react-big-calendar.css";

import styles from "./CalendarView.module.css";
import { useState } from "react";

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
const myEventsList = [
  {
    title: "Trening A",
    start: new Date(2025, 9, 20, 17, 0),
    end: new Date(2025, 9, 20, 18, 0),
  },
  {
    title: "Mecz B",
    start: new Date(2025, 9, 22, 19, 0),
    end: new Date(2025, 9, 22, 20, 30),
  },
];
function CalendarView() {
  const [date, setDate] = useState(new Date());

  const CustomHeader = ({ label, onNavigate }) => (
    <div className={styles.header}>
      <button onClick={() => onNavigate("PREV")}>Poprzedni</button>
      <span className={styles.center}>{label}</span>
      <button onClick={() => onNavigate("NEXT")}>Następny</button>
    </div>
  );
  return (
    <div className={styles.container}>
      <Calendar
        localizer={localizer}
        events={myEventsList}
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
