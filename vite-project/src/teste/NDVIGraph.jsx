import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const NDVIGraph = ({ data }) => {
  const chartContainer = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (chartContainer && chartContainer.current) {
      const labels = data.map(entry => entry.data);
      const values = data.map(entry => entry.media_ndvi);

      const ctx = chartContainer.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Média NDVI',
            data: values,
            borderColor: 'green',
            fill: false
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              min: 0,
              max: 0.8
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Média NDVI ao longo do tempo'
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div>
      <canvas ref={chartContainer}></canvas>
    </div>
  );
};

export default NDVIGraph;
