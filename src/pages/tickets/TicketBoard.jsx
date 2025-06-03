// src/pages/tickets/TicketBoard.jsx
import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/axiosInstance";
import { Download, Eye } from "react-feather";
import ExportButton from "../../components/ExportButton";
import StatusFilterWithCheckboxes from "../../components/StatusFilterWithCheckboxes";
import PriorityFilterWithCheckboxes from "../../components/PriorityFilterWithCheckboxes";
import { saveAs } from "file-saver";

const PRIORITIES = ["Low", "Medium", "High", "Critical"];

export default function TicketBoard() {
  const { user } = useSelector((s) => s.auth);
  const isAgent = user.role === "agent";
  const isAdmin = user.role === "admin";

  const [tickets, setTickets] = useState([]);
  const [agentFilter, setAgentFilter] = useState("all"); // 'all' | 'assigned'
  const [statusFilter, setStatusFilter] = useState(["Open"]); // array of statuses
  const [priorityFilter, setPriorityFilter] = useState([]); // array of priorities
  const [loading, setLoading] = useState(false);

  // Pagination & Sorting
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" }); // { key: 'title' | 'createdAt', direction: 'asc' | 'desc' }

  const navigate = useNavigate();

  // determine endpoint
  const endpoint = isAdmin
    ? "/api/tickets"
    : isAgent
    ? agentFilter === "assigned"
      ? "/api/tickets/assigned"
      : "/api/tickets"
    : "/api/tickets/my";

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const params = {};
        if (statusFilter.length > 0) params.status = statusFilter.join(",");
        if (priorityFilter.length > 0) params.priority = priorityFilter.join(",");

        const { data } = await axios.get(endpoint, { params });
        setTickets(data);
        setCurrentPage(1); // reset to first page when data changes
      } catch (err) {
        console.error("Error fetching tickets:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [endpoint, statusFilter, priorityFilter]);

  // Sorting logic
  const changeSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        const newDir = prev.direction === "asc" ? "desc" : "asc";
        return { key, direction: newDir };
      }
      return { key, direction: "asc" };
    });
  };

  const sortedTickets = useMemo(() => {
    if (!sortConfig.key) return [...tickets];

    return [...tickets].sort((a, b) => {
      let aKey = a[sortConfig.key];
      let bKey = b[sortConfig.key];

      if (sortConfig.key === "title") {
        aKey = aKey.toLowerCase();
        bKey = bKey.toLowerCase();
        if (aKey < bKey) return sortConfig.direction === "asc" ? -1 : 1;
        if (aKey > bKey) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      }

      if (sortConfig.key === "createdAt") {
        const aDate = new Date(aKey);
        const bDate = new Date(bKey);
        return sortConfig.direction === "asc"
          ? aDate - bDate
          : bDate - aDate;
      }

      return 0;
    });
  }, [tickets, sortConfig]);

  // Pagination logic
  const pageCount = Math.ceil(sortedTickets.length / itemsPerPage);
  const paginatedTickets = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return sortedTickets.slice(startIdx, startIdx + itemsPerPage);
  }, [sortedTickets, currentPage]);

  const downloadTickets = async (e, ticket) => {
    e.preventDefault();
    const url = `/api/tickets/${ticket?._id}/export`;
    try {
      setLoading(true);
      const res = await axios.get(url, { responseType: "blob" });
      const filename = `${ticket?.ticketId || "ticket"}_export.xlsx`;
      saveAs(res.data, filename);
    } catch (err) {
      console.error("Export failed", err);
      alert("Failed to download tickets.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading tickets…</div>;
  }

  return (
    <div className="p-6">
      {/* Top Bar */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
        <div className="flex flex-wrap items-center space-x-2 gap-2">
          <h1 className="text-2xl font-bold">
            {isAdmin
              ? "All Tickets"
              : isAgent && agentFilter === "assigned"
              ? "My Assigned Tickets"
              : "All Tickets"}
          </h1>

          {/* Agent-only filter */}
          {isAgent && (
            <div className="flex space-x-1">
              <button
                onClick={() => setAgentFilter("all")}
                className={`px-3 py-1 rounded ${
                  agentFilter === "all"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setAgentFilter("assigned")}
                className={`px-3 py-1 rounded ${
                  agentFilter === "assigned"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                Assigned
              </button>
            </div>
          )}
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-wrap items-center space-x-2 gap-2">
          <StatusFilterWithCheckboxes
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
          <PriorityFilterWithCheckboxes
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
          />
          <ExportButton />
          <Link
            to="/tickets/create"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Create Ticket
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded mt-6">
        <table className="w-full bg-white shadow rounded overflow-hidden">
          <thead className="shadow border border-gray-50 bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>

              <th
                className="px-4 py-2 text-left cursor-pointer flex items-center"
                onClick={() => changeSort("title")}
              >
                Title
                {sortConfig.key === "title" && (
                  <span className="ml-1">
                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>

              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Priority</th>
              <th className="px-4 py-2 text-left">Status</th>

              <th
                className="px-4 py-2 text-left cursor-pointer flex items-center"
                onClick={() => changeSort("createdAt")}
              >
                Created At
                {sortConfig.key === "createdAt" && (
                  <span className="ml-1">
                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>

              <th className="px-4 py-2 text-left">SLA Due</th>
              <th className="px-4 py-2 text-left">SLA Status</th>
              {isAdmin && <th className="px-4 py-2 text-left">Created By</th>}
              {isAdmin && (
                <th className="px-4 py-2 text-left">Assigned To</th>
              )}
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTickets.length === 0 && (
              <tr>
                <td colSpan="11" className="p-4 text-center text-gray-500">
                  No Tickets found.
                </td>
              </tr>
            )}
            {paginatedTickets.map((t) => (
              <tr
                key={t._id}
                className="hover:bg-gray-50 border-b border-gray-200"
              >
                <td className="px-4 py-2">{t.ticketId}</td>
                <td className="px-4 py-2">
                  <Link
                    to={`/tickets/${t._id}`}
                    className="text-blue-600 underline"
                  >
                    {t.title}
                  </Link>
                </td>
                <td className="px-4 py-2">{t.category?.name || "—"}</td>
                <td className="px-4 py-2">{t.priority}</td>
                <td className="px-4 py-2">{t.status}</td>
                <td className="px-4 py-2">
                  {new Date(t.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  {t.slaDueDate
                    ? new Date(t.slaDueDate).toLocaleString()
                    : "—"}
                </td>
                <td className="px-4 py-2">
                  {t.isSlaBreached ? (
                    <span className="text-red-600 font-semibold">Breached</span>
                  ) : t.slaReminderSent ? (
                    <span className="text-orange-600">Upcoming</span>
                  ) : (
                    <span className="text-green-600">OK</span>
                  )}
                </td>
                {isAdmin && (
                  <td className="px-4 py-2">{t.createdBy?.name}</td>
                )}
                {isAdmin && (
                  <td className="px-4 py-2">{t.assignedTo?.name}</td>
                )}
                <td className="px-4 py-2">
                  <button
                    className="text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
                    onClick={(e) => downloadTickets(e, t)}
                  >
                    <Download />
                  </button>
                  <button
                    className="text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer ml-2"
                    onClick={() => navigate(`/tickets/${t._id}`)}
                  >
                    <Eye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {pageCount > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: pageCount }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, pageCount))}
            disabled={currentPage === pageCount}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
