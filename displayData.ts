// src/displayData.ts
import { scrapeCDCDiabetesData } from './src/SiteData.js';
import Chart from 'chart.js/auto';

async function renderGraph() {
  const allTablesData = await scrapeCDCDiabetesData();
  if (!allTablesData || allTablesData.length === 0) {
    console.error('No data available to render graph.');
    return;
  }

  // Use the first table or the second table if available
  const tableData = allTablesData.length > 1 ? allTablesData[1] : allTablesData[0];

  // Get the existing canvas element instead of creating a new one
  const canvas = document.getElementById('cdc-diabetes-chart') as HTMLCanvasElement;
  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Failed to get canvas 2D context.');
    return;
  }

  // Extract labels (x-axis) from the first column
  const labels = tableData.data.map(row => row[tableData.headers[0]]);

  // Extract datasets for other columns, converting values to numbers
  const datasets = tableData.headers.slice(1).map((header, index) => {
    const data = tableData.data.map(row => {
      const val = row[header];
      // Handle both string values and already parsed numbers
      const strVal = typeof val === 'string' ? val : String(val);
      const num = Number(strVal.replace(/[^0-9.-]+/g, '')); // Remove non-numeric chars
      return isNaN(num) ? 0 : num;
    });

    // Generate colors for each dataset
    const colorHue = (index * 60) % 360;
    const backgroundColor = `hsla(${colorHue}, 70%, 70%, 0.4)`;
    const borderColor = `hsl(${colorHue}, 70%, 50%)`;

    return {
      label: header,
      data,
      fill: false,
      backgroundColor,
      borderColor,
      borderWidth: 2,
      tension: 0.1,
    };
  });

  // Create the Chart.js line chart
  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets,
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: tableData.caption || 'CDC Diabetes Data',
          font: {
            size: 18,
          },
        },
        legend: {
          position: 'top',
        },
        tooltip: {
          mode: 'nearest',
          intersect: false,
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: tableData.headers[0],
          },
        },
        y: {
          title: {
            display: true,
            text: 'Percentage (95% CI)',
          },
          beginAtZero: true,
        },
      },
    },
  });
}

// Run the renderGraph function on page load
window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, rendering graph...');
  renderGraph().catch(error => {
    console.error('Error rendering graph:', error);
  });
});

// Export for potential reuse
export { renderGraph };