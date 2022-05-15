import {Chart as ChartJS} from "chart.js/auto"
import {Chart as Chart2} from "chart.js"
import { Chart, Radar } from "react-chartjs-2";
import customHover from "./customHover"

export const RadarChart = ({chartData, chartOptions}) => {
  Chart2.register(customHover)
  return (
      <Radar
        plugins={[customHover]}
        data={chartData}
        options={chartOptions}
      />
  );
};
