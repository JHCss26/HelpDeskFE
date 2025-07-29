import { useEffect, useState } from "react";
import StatusCards from "../../components/StatusCard";
import TicketSummaryCharts from "../../components/TicketSummaryCharts";
import { useNavigate } from "react-router-dom";
import TicketBarChart from "../../components/TicketBarChart";
import CustomDateFilter from "../../components/CustomDateFilter";
const FILTER_KEY = "ticketFilterData";
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
    return `${year}-${month}`;
  });

  const [filterData, setFilterData] = useState(() => {
    const stored = localStorage.getItem(FILTER_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (filterData) {
      localStorage.setItem(FILTER_KEY, JSON.stringify(filterData));
    }
  }, [filterData]);

  const extractYearFromFilter = (filterData) => {
    if (!filterData) return new Date().getFullYear(); // fallback to current year
    if (filterData.filterType === "Custom Range") {
      return new Date(filterData.start).getFullYear(); // or use end if preferred
    }
    return new Date(filterData.date).getFullYear();
  };

  const barGraphYear = extractYearFromFilter(filterData);

  useEffect(() => {
    document.title = "Admin Dashboard";
  }, []);

  const handleDateChange = (filterData) => {
    setFilterData(filterData);
  };

  return (
    <div className="flex flex-col h-full w-full overflow-auto relative">
      <div className="flex items-center justify-between px-4 py-2 bg-white shadow-sm sticky top-0 z-20">
        <h1 className="text-lg font-semibold text-gray-800">Admin Dashboard</h1>

        <div className="flex items-center gap-3">
          <button
            className="text-xs px-3 py-3 w-full bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={() => navigate("/tickets/create")}
          >
            Create Ticket
          </button>

          <div className="w-fit">
            <CustomDateFilter onChange={handleDateChange} />
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col space-y-4">
        {filterData && <StatusCards filterData={filterData} />}
        {filterData && <TicketSummaryCharts filterData={filterData} />}
        {filterData && <TicketBarChart year={barGraphYear} />}
      </div>
    </div>
  );
};

export default AdminDashboard;
