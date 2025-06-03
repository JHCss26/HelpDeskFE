import { useEffect, useState } from "react";
import StatusCards from "../../components/StatusCard";
import TicketSummaryCharts from "../../components/TicketSummaryCharts";
import { useNavigate } from "react-router-dom";
import TicketBarChart from "../../components/TicketBarChart";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
    return `${year}-${month}`;
  });
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  useEffect(() => {
    document.title = "Admin Dashboard";
  }, []);
  useEffect(() => {
    if (selectedDate) {
      const [year, month] = selectedDate.split("-");
      setYear(year);
      setMonth(month);
    } else {
      const today = new Date();
      setYear(today.getFullYear());
      setMonth((today.getMonth() + 1).toString().padStart(2, "0"));
    }
  }, [selectedDate]);
  return (
    <div className="flex flex-col h-full w-full overflow-auto relative">
      <div className="flex items-center justify-between p-4 bg-gray-100 shadow sticky top-0 z-10">
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        {/* Additional controls or buttons can be added here */}
        <div className="flex space-x-2">
          {/* Example button, can be replaced with actual functionality */}
          <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => navigate("/tickets/create")}>
            Create Ticket
          </button>

          {/* Add Data picker for filtering */}
          <input
            type="month"
            className="px-3 py-2 border-white shadow bg-white rounded"
            placeholder="Select Month"
            style={{ maxWidth: "200px" }}
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="p-4 flex flex-col space-y-4">
        <StatusCards year={year} month={month} />
        <TicketSummaryCharts year={year} month={month} />
        <TicketBarChart year={year} />
      </div>
    </div>
  );
};

export default AdminDashboard;
