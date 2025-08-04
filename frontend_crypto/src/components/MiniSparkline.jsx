import React from 'react';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

export function MiniSparkline({ data = [] }) {
  if (!Array.isArray(data) || data.length === 0) {
    return <div className="text-xs text-gray-400">No chart</div>;
  }

  const chartData = {
    labels: data.map((_, i) => i), // using index as x-axis
    datasets: [
      {
        data,
        borderColor: '#22c55e', // green-500
        backgroundColor: 'transparent',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    elements: {
      line: { borderJoinStyle: 'round' },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        intersect: false,
        mode: 'index',
        callbacks: {
          label: (ctx) => `Price: $${ctx.raw.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  };

  return (
    <div className="h-16 w-full">
      <Line data={chartData} options={options} />
    </div>
  );
}
