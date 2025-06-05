import React, { useState, useRef, useEffect } from "react";

// Priorities for PriorityFilterWithCheckboxes
const PRIORITIES = ["All", "Low", "Medium", "High", "Critical"];

export default function PriorityFilterWithCheckboxes({
  priorityFilter,
  setPriorityFilter,
}) {
  const actual = PRIORITIES.slice(1);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const allSelected = priorityFilter.length === actual.length;
  const noneSelected = priorityFilter.length === 0;

  const toggle = (item) => {
    if (item === "All") {
      setPriorityFilter((prev) =>
        prev.length === actual.length ? [] : [...actual]
      );
    } else {
      setPriorityFilter((prev) =>
        prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
      );
    }
  };

  // Label with ellipsis if >3
  let label;
  if (allSelected || noneSelected) {
    label = "All Priorities";
  } else if (priorityFilter.length <= 3) {
    label = priorityFilter.join(", ");
  } else {
    const extra = priorityFilter.length - 3;
    label = `${priorityFilter.slice(0, 3).join(", ")}, +${extra} more`;
  }

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="w-auto text-left border-gray-200 bg-[#fff] border-2 rounded px-2 py-1 flex justify-between items-center"
      >
        {label}
        <svg
          className="h-5 w-5 text-gray-600"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute mt-1 mx-0.5 w-auto bg-white  shadow-lg z-50">
          {PRIORITIES.map((item) => (
            <label
              key={item}
              className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="checkbox"
                className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded"
                checked={
                  item === "All"
                    ? allSelected || noneSelected
                    : priorityFilter.includes(item)
                }
                onChange={() => toggle(item)}
              />
              <span className="text-sm text-gray-700">{item}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
