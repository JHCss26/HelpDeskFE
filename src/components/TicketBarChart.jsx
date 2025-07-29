import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "../api/axiosInstance";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default function TicketBarChart({ year }) {
  const [dataPoints, setDataPoints] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const selectedYear = year || new Date().getFullYear();

    axios
      .get("/api/tickets/status/bargraph", {
        params: {
          filterType: "Yearly",
          date: `${selectedYear}-01-01T00:00:00.000Z`,
        },
      })
      .then((res) => setDataPoints(res.data.data))
      .catch((err) => {
        console.error("Error fetching yearly status:", err);
        setError(err.response?.data?.error || err.message);
      });
  }, [year]);

  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!dataPoints) return <div>Loading…</div>;

  const openCounts = dataPoints.map((d) => d.open);
  const closedCounts = dataPoints.map((d) => d.closed);
  const inProgressCounts = dataPoints.map((d) => d.inProgress);
  const labels = MONTH_NAMES;

  const chartData = {
    labels,
    datasets: [
      {
        label: "Open",
        data: openCounts,
        backgroundColor: "#36A2EB",
      },
      {
        label: "Closed",
        data: closedCounts,
        backgroundColor: "#FF6384",
      },
      {
        label: "In Progress",
        data: inProgressCounts,
        backgroundColor: "#FFCE56",
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        stacked: false,
        title: {
          display: true,
          text: "Month",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Tickets",
        },
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.parsed.y}`,
        },
      },
    },
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow min-w-260 mx-auto">
      <h3 className="text-lg font-semibold mb-4 text-center">
        {year ? `${year} ` : ""}Open vs Closed vs In Progress Tickets by Month
      </h3>
      <Bar data={chartData} options={options} />
    </div>
  );
}
