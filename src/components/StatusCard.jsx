import React, { useState, useEffect } from "react";
import axios from "../api/axiosInstance";
import MetricCard from "./MetricCard";

export default function StatusCards({year, month}) {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
     const params = {};
    if (year) params.year = year;
    if (month) params.month = month;
    axios
      .get("/api/tickets/status/totals", { params })
      .then((res) => {
        // expecting total, totalPercentChange, byStatus, statusPercentChange
        setMetrics({
          total: res.data.total,
          open: res.data.byStatus.Open || 0,
          closed: res.data.byStatus.Closed || 0,
          inProgress: res.data.byStatus["In Progress"] || 0,
          onHold: res.data.byStatus["On Hold"] || 0,
          waitingForCustomer: res.data.byStatus["Waiting for Customer"] || 0,
        });
      })
      .catch((err) => setError(err.response?.data?.error || err.message));
  }, [setMetrics, year, month]);

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }
  if (!metrics) return <div>Loading…</div>;

  return (
    <div className="flex space-x-4 overflow-x-auto p-4 justify-center">
      <MetricCard
        title="Total Tickets"
        value={metrics.total}
        bgColor="bg-gray-300"
      />
      <MetricCard
        title="Open Tickets"
        value={metrics.open}
        bgColor="bg-orange-600"
        textColor="text-white"
      />
      <MetricCard
        title="Closed Tickets"
        value={metrics.closed}
        bgColor="bg-sky-300"
      />

      <MetricCard
        title="In Progress Tickets"
        value={metrics.inProgress}
        bgColor="bg-yellow-300"
        textColor="text-black"
      />
      <MetricCard
        title="On Hold Tickets"
        value={metrics.onHold}
        bgColor="bg-purple-300"
        textColor="text-black"
      />
      <MetricCard
        title="Waiting for Customer"
        value={metrics.waitingForCustomer}
        bgColor="bg-red-300"
        textColor="text-black"
      />

      {/* Add other metric cards as needed */}
    </div>
  );
}
