// src/components/PieChart.jsx
import React from 'react';
import { Pie } from 'react-chartjs-2';

export default function PieChart({ title, labels, data, colors, size = 150 }) {
  return (
    <div className="p-2 shadow rounded-2xl bg-white flex flex-col items-center" style={{ width: size, height: size + 40 }}>
      <h5 className="text-lg mb-1 text-center">{title}</h5>
      <div style={{ width: size, height: size }}>
        <Pie
          data={{
            labels,
            datasets: [{
              data,
              backgroundColor: colors,
            }]
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom', labels: { boxWidth: 10, boxHeight: 10, padding: 5 } },
              title: { display: false }
            }
          }}
        />
      </div>
    </div>
  );
}