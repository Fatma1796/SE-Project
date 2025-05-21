// import React from 'react';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import { Bar } from 'react-chartjs-2';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const EventAnalytics = ({ analyticsData }) => {
//   const options = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'top',
//       },
//       title: {
//         display: true,
//         text: 'Event Ticket Bookings',
//         color: '#2d3748',
//         font: {
//           size: 18
//         }
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         max: 100,
//         ticks: {
//           callback: value => `${value}%`
//         }
//       }
//     }
//   };

//   const data = {
//     labels: analyticsData.chartData.labels,
//     datasets: [
//       {
//         label: 'Tickets Booked',
//         data: analyticsData.chartData.bookedPercentages,
//         backgroundColor: 'rgba(59, 130, 246, 0.5)',
//         borderColor: 'rgb(59, 130, 246)',
//         borderWidth: 1,
//       }
//     ]
//   };

//   return (
//     <div className="analytics-container">
//       <div className="chart-wrapper" style={{ maxHeight: '400px' }}>
//         <Bar options={options} data={data} />
//       </div>
//       <div className="analytics-details">
//         <h3 className="text-xl font-semibold mb-4">Detailed Analytics</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {analyticsData.analytics.map(event => (
//             <div 
//               key={event.eventId} 
//               className="p-4 border rounded-lg shadow-sm bg-white"
//             >
//               <h4 className="font-semibold text-lg mb-2">{event.title}</h4>
//               <p>Total Tickets: {event.totalTickets}</p>
//               <p>Tickets Booked: {event.ticketsBooked}</p>
//               <p className="font-medium text-blue-600">
//                 {event.bookedPercentage}% Booked
//               </p>
//               <p className={`mt-2 inline-block px-2 py-1 rounded-full text-sm ${
//                 event.status === 'approved' ? 'bg-green-100 text-green-800' :
//                 event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                 'bg-red-100 text-red-800'
//               }`}>
//                 {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EventAnalytics;
import React from 'react';
import '../services/analyticschart.css';  // Add this import

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const EventAnalytics = ({ analyticsData }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            weight: 'bold'
          },
          padding: 20,
          color: '#4a5568'
        }
      },
      title: {
        display: true,
        text: 'Event Ticket Bookings',
        color: '#2d3748',
        font: {
          size: 24,
          weight: 'bold'
        },
        padding: {
          top: 20,
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(26, 32, 44, 0.8)',
        titleFont: {
          size: 16,
          weight: 'bold'
        },
        bodyFont: {
          size: 14
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          callback: value => `${value}%`,
          font: {
            size: 12,
            weight: '500'
          },
          padding: 8
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12,
            weight: '500'
          },
          padding: 8
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    },
    layout: {
      padding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      }
    }
  };

  const data = {
    labels: analyticsData.chartData.labels,
    datasets: [
      {
        label: 'Tickets Booked',
        data: analyticsData.chartData.bookedPercentages,
        backgroundColor: [
          'rgba(66, 153, 225, 0.6)',
          'rgba(72, 187, 120, 0.6)',
          'rgba(246, 173, 85, 0.6)',
          'rgba(237, 100, 166, 0.6)',
          'rgba(159, 122, 234, 0.6)'
        ],
        borderColor: [
          'rgb(66, 153, 225)',
          'rgb(72, 187, 120)',
          'rgb(246, 173, 85)',
          'rgb(237, 100, 166)',
          'rgb(159, 122, 234)'
        ],
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: [
          'rgba(66, 153, 225, 0.8)',
          'rgba(72, 187, 120, 0.8)',
          'rgba(246, 173, 85, 0.8)',
          'rgba(237, 100, 166, 0.8)',
          'rgba(159, 122, 234, 0.8)'
        ],
        hoverBorderWidth: 3
      }
    ]
  };

 // ...existing imports and ChartJS registration...

  // ...existing options and data objects...

  return (
    <div className="analytics-container">
      <div className="chart-wrapper" style={{ height: '500px' }}>
        <Bar options={options} data={data} />
      </div>
      <div className="analytics-details">
        <h3 className="text-xl font-semibold mb-4">Detailed Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analyticsData.analytics.map(event => (
            <div 
              key={event.eventId} 
              className="p-4 border rounded-lg shadow-sm bg-white"
            >
              <h4 className="font-semibold text-lg mb-2">{event.title}</h4>
              <p>Total Tickets: {event.totalTickets}</p>
              <p>Tickets Booked: {event.ticketsBooked}</p>
              <p className="font-medium text-blue-600">
                {event.bookedPercentage}% Booked
              </p>
              <p className={`mt-2 inline-block px-2 py-1 rounded-full text-sm ${
                event.status === 'approved' ? 'bg-green-100 text-green-800' :
                event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventAnalytics;