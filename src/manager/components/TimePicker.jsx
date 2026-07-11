import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { fromZonedTime, toZonedTime } from "date-fns-tz";

const TimePicker = ({ value, onChange, timezone }) => {

  // Convert stored HH:mm -> Date object in selected timezone
  const getZonedDate = () => {
    if (!value) return null;

    const date = new Date(`1970-01-01T${value}:00`);

    return toZonedTime(date, timezone);
  };

  return (
    <DatePicker
      selected={getZonedDate()}
      onChange={(date) => {
        if (!date) return;

        // Convert picked timezone time -> UTC
        const zonedDate = fromZonedTime(date, timezone);

        const hh = String(zonedDate.getHours()).padStart(2, "0");
        const mm = String(zonedDate.getMinutes()).padStart(2, "0");

        onChange(`${hh}:${mm}`);
      }}
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={1}
      timeCaption="Time"
      dateFormat="HH:mm"
      className="border rounded px-2 h-7 text-xs w-24"
    />
  );
};

export default TimePicker;