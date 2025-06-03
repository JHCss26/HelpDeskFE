import { Doughnut } from "react-chartjs-2";

export default function DoughnutChart({
  title,
  labels,
  data,
  colors = "grey",
  width = 200,
  height = 200,
}) {
  const hasData = Array.isArray(data) && data.some((value) => value > 0);

  const chartData = {
    labels: hasData ? labels : ["No Data"],
    datasets: [
      {
        data: hasData ? data : [1],
        backgroundColor: hasData
          ? colors
          : ["#ccc"], // fallback grey color
      },
    ],
  };

  return (
    <div
      className="p-4 shadow rounded-2xl bg-white overflow-hidden"
      style={{ width, boxSizing: "border-box", flexShrink: 0 }}
    >
      <h3 className="text-lg mb-2 text-center" style={{ maxWidth: width }}>
        {title}
      </h3>
      <div style={{ width: "100%", height }}>
        <Doughnut
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              title: { display: false },
              tooltip: { enabled: hasData },
            },
          }}
        />
      </div>

      {/* Custom legend */}
      {hasData && (
        <div
          className="mt-4 grid grid-cols-2 gap-2 text-sm"
          style={{ width: "100%" }}
        >
          {labels.map((label, idx) => (
            <div
              key={idx}
              className="flex items-center truncate"
              style={{ maxWidth: width / 2 - 16, }}
              title={label}
            >
              <span
                className="inline-block mr-2 flex-shrink-0"
                style={{
                  backgroundColor: colors[idx] || "#ccc",
                  width: 12,
                  height: 12,
                }}
              />
              <span className="truncate">{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
