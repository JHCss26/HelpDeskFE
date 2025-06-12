import React, { useState, useRef, useEffect } from "react";
import axios from "../api/axiosInstance"; // adjust path as needed

export default function UserFilterWithCheckboxes({ userFilter, setUserFilter }) {
  const [allUsers, setAllUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/admin/users?role=agent");
        setAllUsers(res.data);
      } catch (err) {
        console.error("Failed to load agent users:", err);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const userIds = allUsers.map((u) => u._id);
  const allSelected = userFilter.length === userIds.length;
  const noneSelected = userFilter.length === 0;

  const toggle = (id) => {
    if (id === "All") {
      setUserFilter(prev => (prev.length === userIds.length ? [] : [...userIds]));
    } else {
      setUserFilter(prev =>
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
    }
  };

  const labelNames = allUsers
    .filter((u) => userFilter.includes(u._id))
    .map((u) => u.name);

  let label;
  if (allSelected || noneSelected) {
    label = "All Users";
  } else if (labelNames.length <= 3) {
    label = labelNames.join(", ");
  } else {
    const extra = labelNames.length - 3;
    label = `${labelNames.slice(0, 3).join(", ")}, +${extra} more`;
  }

 return (
  <div className="relative inline-block" ref={ref}>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Filter by Agent
    </label>
    <button
      type="button"
      onClick={() => setIsOpen((o) => !o)}
      className="w-auto text-left border-gray-200 bg-white border-2 rounded px-2 py-1 flex justify-between items-center"
    >
      {label}
      <svg
        className="h-5 w-5 text-gray-600 ml-2"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" />
      </svg>
    </button>
    {isOpen && (
      <div className="absolute mt-1 w-auto bg-white shadow-lg z-50 max-h-60 overflow-auto">
        <label className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
          <input
            type="checkbox"
            className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded"
            checked={allSelected || noneSelected}
            onChange={() => toggle("All")}
          />
          <span className="text-sm text-gray-700">All</span>
        </label>
        {allUsers.map((user) => (
          <label
            key={user._id}
            className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            <input
              type="checkbox"
              className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded"
              checked={userFilter.includes(user._id)}
              onChange={() => toggle(user._id)}
            />
            <span className="text-sm text-gray-700">{user.name}</span>
          </label>
        ))}
      </div>
    )}
  </div>
);

}
