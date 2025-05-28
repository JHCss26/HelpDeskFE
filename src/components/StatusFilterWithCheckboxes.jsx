import React, { useState, useRef, useEffect } from 'react';

const STATUSES = [
  'All',
  'Open',
  'In Progress',
  'On Hold',
  'Waiting for Customer',
  'Resolved',
  'Closed',
  'Cancelled',
];

export default function StatusFilterWithCheckboxes({ statusFilter, setStatusFilter }) {
  const actualStatuses = STATUSES.slice(1); // omit 'All'
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  // close when clicking outside
  useEffect(() => {
    const onClick = e => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const allSelected = statusFilter.length === actualStatuses.length;
  const noneSelected = statusFilter.length === 0;

  const toggle = (status) => {
    if (status === 'All') {
      setStatusFilter(prev =>
        prev.length === actualStatuses.length ? [] : [...actualStatuses]
      );
    } else {
      setStatusFilter(prev => {
        const isOn = prev.includes(status);
        return isOn ? prev.filter(s => s !== status) : [...prev, status];
      });
    }
  };

  // Determine button label with ellipsis if more than 3 selected
  let buttonLabel;
  if (allSelected || noneSelected) {
    buttonLabel = 'All Statuses';
  } else if (statusFilter.length <= 2) {
    buttonLabel = statusFilter.join(', ');
  } else {
    const extras = statusFilter.length - 2;
    buttonLabel = `${statusFilter.slice(0, 2).join(', ')}, +${extras} more`;
  }

  return (
    <div className="relative inline-block" ref={ref}>
      {/* fake “select” button */}
      <button
        type="button"
        onClick={() => setIsOpen(o => !o)}
        className="w-auto text-left  border-gray-200 bg-[#fff] border-2 rounded px-2 py-1 flex justify-between items-center"
      >
        {buttonLabel}
        <svg
          className="h-5 w-5 text-gray-600"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" />
        </svg>
      </button>

      {/* dropdown menu */}
      {isOpen && (
        <div className="absolute mt-0.5 mx-0.5 w-75 bg-[#fff] shadow-lg z-50">
          {STATUSES.map(s => (
            <label
              key={s}
              className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="checkbox"
                className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded"
                checked={
                  s === 'All'
                    ? allSelected || noneSelected
                    : statusFilter.includes(s)
                }
                onChange={() => toggle(s)}
              />
              <span className="text-sm text-gray-700">{s}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
