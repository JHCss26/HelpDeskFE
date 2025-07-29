import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

const FILTER_TYPES = ["Daily", "Weekly", "Monthly", "Yearly", "Custom Range"];

export default function CustomDateFilter({ onChange }) {
  const [filterType, setFilterType] = useState("Daily");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [rangeStart, setRangeStart] = useState(new Date());
  const [rangeEnd, setRangeEnd] = useState(new Date());

  useEffect(() => {
    const payload =
      filterType === "Custom Range"
        ? {
            filterType,
            start: rangeStart.toISOString(),
            end: rangeEnd.toISOString(),
          }
        : {
            filterType,
            date: selectedDate.toISOString(),
          };

    if (onChange) onChange(payload);
  }, [filterType, selectedDate, rangeStart, rangeEnd]);

  const renderDatePicker = () => {
    const baseClass =
      "text-xs px-1.5 py-0.5 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500";

    switch (filterType) {
      case "Daily":
        return (
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd/MM/yyyy"
            className={baseClass}
          />
        );
      case "Weekly":
        return (
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            showWeekNumbers
            dateFormat="wo 'week of' MMM yyyy"
            className={baseClass}
          />
        );
      case "Monthly":
        return (
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            showMonthYearPicker
            dateFormat="MM/yyyy"
            className={baseClass}
          />
        );
      case "Yearly":
        return (
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            showYearPicker
            dateFormat="yyyy"
            className={baseClass}
          />
        );
      case "Custom Range":
        return (
          <div className="flex gap-1">
            <DatePicker
              selected={rangeStart}
              onChange={(date) => setRangeStart(date)}
              selectsStart
              startDate={rangeStart}
              endDate={rangeEnd}
              dateFormat="dd/MM/yyyy"
              className={baseClass}
              placeholderText="Start Date"
            />
            <DatePicker
              selected={rangeEnd}
              onChange={(date) => setRangeEnd(date)}
              selectsEnd
              startDate={rangeStart}
              endDate={rangeEnd}
              dateFormat="dd/MM/yyyy"
              className={baseClass}
              placeholderText="End Date"
            />
          </div>
        );
      default:
        return null;
    }
  };

  const renderSelectedText = () => {
    if (filterType === "Custom Range") {
      return `${format(rangeStart, "dd/MM/yyyy")} to ${format(
        rangeEnd,
        "dd/MM/yyyy"
      )}`;
    }
    return format(
      selectedDate,
      filterType === "Daily"
        ? "dd/MM/yyyy"
        : filterType === "Weekly"
        ? "wo 'week of' MMM yyyy"
        : filterType === "Monthly"
        ? "MMMM yyyy"
        : "yyyy"
    );
  };

  return (
    <div className="w-full flex flex-col gap-1 bg-white rounded-md px-3 py-2 shadow-sm border border-gray-200">
      <label className="text-xs font-medium text-gray-600">Date Filter</label>
      <div className="flex items-center gap-2">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="text-xs px-1.5 py-0.5 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {FILTER_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <div className="flex-grow">{renderDatePicker()}</div>

        <div className="text-xs text-gray-500 font-normal whitespace-nowrap">
          {renderSelectedText()}
        </div>
      </div>
    </div>
  );
}
