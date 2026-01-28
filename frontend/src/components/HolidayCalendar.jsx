import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function HolidayCalendar() {
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    async function fetchHolidays() {
      const year = new Date().getFullYear();
      const apiKey = "4za5NelZWIlJywjRZ9ZgM4NbPy1gs0Zb";

      const url = `https://calendarific.com/api/v2/holidays?api_key=${apiKey}&country=IN&year=${year}`;

      const res = await fetch(url);
      const data = await res.json();

      setHolidays(
        data.response.holidays.map(h => ({
          date: h.date.iso.split("T")[0],
          name: h.name
        }))
      );
    }

    fetchHolidays();
  }, []);

  function tileContent({ date }) {
    const iso = date.toISOString().split("T")[0];
    const holiday = holidays.find(h => h.date === iso);

    if (!holiday) return null;

    return (
      <div className="holiday-wrapper">
        <div className="tooltip">{holiday.name}</div>
      </div>
    );
  }

  function tileClassName({ date }) {
    const iso = date.toISOString().split("T")[0];
    return holidays.some(h => h.date === iso) ? "holiday-tile" : null;
  }

  return (
    <div class="flex justify-center">
    <div className="mt-6 p-4 rounded-xl shadow w-400">
      <h2 className="text-lg font-semibold mb-2">📅 Holiday Calendar</h2>

      <Calendar
        tileClassName={tileClassName}
        tileContent={tileContent}
      />

      <style>{`
        .holiday-tile {
          background-color: #ffe5e5 !important;
          color: #b80000 !important;
          font-weight: bold;
          border-radius: 8px;
          position: relative;
        }

        /* wrapper for tooltip to anchor correctly */
        .holiday-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
        }

        /* tooltip default hidden */
        .tooltip {
          visibility: hidden;
          opacity: 0;
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          background: #333;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          z-index: 999;
          transition: opacity 0.2s ease-in-out;
          white-space: nowrap;
        }

        /* arrow */
        .tooltip::after {
          content: "";
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          border-width: 5px;
          border-style: solid;
          border-color: #333 transparent transparent transparent;
        }

        /* show tooltip on hover */
        .holiday-tile:hover .tooltip {
          visibility: visible;
          opacity: 1;
        }
      `}</style>
    </div>
    </div>
  );
}
