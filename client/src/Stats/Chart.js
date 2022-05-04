import {Chart as ChartJS} from 'chart.js/auto'
import { Radar } from "react-chartjs-2";

export const RadarChart = ({ chartData }) => {
  return (
      <Radar
        data={chartData}
        options={{
          scales: {
            r: {
            ticks: {
              min: 0,
              max: 1,
              stepSize: 0.2,
              showLabelBackdrop: false,
              backdropColor: "rgba(203, 197, 11, 1)"
            },
            font: {
              weight: "bold"
            },
            pointLabels: {
              font: {
                size: 16
              }
            }
          }
        },
          elements: {
            line: {
              borderWidth: 3
                }
            },
          plugins: {
            title: {
              display: true,
              text: "Song Stats",
              font: {
                size: 17
              }
            },
            legend: {
              display: true,
              position: "top",
              labels: {
                font: {
                  size: 15
                }    
              }     
            }
          }
        }}
      />
  );
};
