import React, { useState, useEffect } from "react";
import axios from "../api/axiosInstance";
import DoughnutChart from "./DoughnutChart";

// A simple reusable color palette
const defaultColors = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
];

export default function TicketSummaryCharts({ filterData }) {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!filterData) return;

    axios
      .get("/api/tickets/summary", { params: filterData })
      .then((response) => setSummary(response.data))
      .catch((err) => {
        console.error(err);
        setError(err.response?.data?.error || err.message);
      });
  }, [filterData]);

  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!summary) return <div>Loading…</div>;

  const { priority, assignees, categories, departments } = summary;
  const chartSize = 180;

  return (
    <div className="w-full flex overflow-x-auto gap-9.5 p-4 mx-auto justify-center">
      <DoughnutChart
        title="By Status"
        labels={Object.keys(summary.status)}
        data={Object.values(summary.status)}
        colors={defaultColors.slice(0, Object.keys(summary.status).length)}
        width={chartSize}
        height={chartSize}
      />

      <DoughnutChart
        title="By Priority"
        labels={Object.keys(priority)}
        data={Object.values(priority)}
        colors={defaultColors.slice(0, Object.keys(priority).length)}
        width={chartSize}
        height={chartSize}
      />

      <DoughnutChart
        title="By Assignee"
        labels={assignees.map((a) => a.assigneeName)}
        data={assignees.map((a) => a.count)}
        colors={defaultColors.slice(0, assignees.length)}
        width={chartSize}
        height={chartSize}
      />

      <DoughnutChart
        title="By Category"
        labels={categories.map((c) => c.categoryName)}
        data={categories.map((c) => c.count)}
        colors={defaultColors.slice(0, categories.length)}
        width={chartSize}
        height={chartSize}
      />

      <DoughnutChart
        title="By Department"
        labels={departments.map((d) => d.departmentName)}
        data={departments.map((d) => d.count)}
        colors={defaultColors.slice(0, departments.length)}
        width={chartSize}
        height={chartSize}
      />
    </div>
  );
}
