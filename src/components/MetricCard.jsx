import React from "react";

export default function MetricCard({
  title,
  value,
  bgColor = "bg-gray-300",
  textColor = "text-black",
}) {
  return (
    <div
      className={`${bgColor} ${textColor} p-4 rounded-2xl shadow min-w-[160px] flex flex-col items-center space-y-2`}
    >
      <span className="text-sm">{title}</span>
      <div className="flex items-center space-x-2">
        <span className="text-xl font-bold">{value}</span>
      </div>
    </div>
  );
}
