// src/components/YearlyStatusBarChart.jsx
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "../api/axiosInstance"; // or wherever you configure axios

// Helper array of month names:
const MONTH_NAMES = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

export default function TicketBarChart({ year }) {
  const [dataPoints, setDataPoints] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Build query param only if a year was passed
    const params = {};
    if (year) params.year = year;

    axios
      .get("/api/tickets/status/bargraph", { params })
      .then((res) => {
        // res.data.data is an array of 12 entries
        setDataPoints(res.data.data);
      })
      .catch((err) => {
        console.error("Error fetching yearly status:", err);
        setError(err.response?.data?.error || err.message);
      });
  }, [year]);

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }
  if (!dataPoints) {
    return <div>Loading…</div>;
  }

  // Extract arrays of open/closed counts
  const openCounts   = dataPoints.map((d) => d.open);
  const closedCounts = dataPoints.map((d) => d.closed);

  // Only show labels (Jan–Dec). If you want month numbers, you can also do `d.month`.
  const labels = MONTH_NAMES;

  const chartData = {
    labels,
    datasets: [
      {
        label: "Open",
        data: openCounts,
        backgroundColor: "#36A2EB", // blue
      },
      {
        label: "Closed",
        data: closedCounts,
        backgroundColor: "#FF6384", // red
      },

    ]
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        stacked: false,
        title: {
          display: true,
          text: "Month"
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Tickets"
        },
        ticks: {
          stepSize: 1
        }
      }
    },
    plugins: {
      legend: {
        position: "top"
      },
      tooltip: {
        callbacks: {
          label: context => {
            const label = context.dataset.label || "";
            const val = context.parsed.y;
            return `${label}: ${val}`;
          }
        }
      }
    }
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow min-w-260 mx-auto">
      <h3 className="text-lg font-semibold mb-4 text-center">
        {year ? `${year} ` : ""}Open vs Closed Tickets by Month
      </h3>
      <Bar data={chartData} options={options} />
    </div>
  );
}
