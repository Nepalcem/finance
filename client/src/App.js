import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { defaultState } from "./components/defaultState";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  scales: {
    y: {
      min: 0, // Set the minimum value for y-axis
      max: 500, // Set the maximum value for y-axis
      beginAtZero: true,
      title: {
        display: true,
        text: "Price",
      },
    },
  },
};


const App = () => {
  const [data, setData] = useState(defaultState);

 useEffect(() => {
   const socket = io("http://localhost:4000");

   socket.on("quotes", (newQuotes) => {
     setData((prevData) => [...prevData, newQuotes[0]]);
   });

   return () => {
     socket.disconnect();
   };
 }, []);
  
  const lastTradeTimes = data.map((item) => item.last_trade_time);
  const pricesArr = data.map((item) => Number(item.price));

const chartData = {
  labels: lastTradeTimes,
  datasets: [
    {
      label: "Prices",
      data: pricesArr,
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
  ],
};

  return (
    <div style={{ textAlign: "center", width: "50%", margin:"0 auto" }}>
      <h1>Stock Quotes</h1>
      <Line options={options} data={chartData} width={600} height={300} />
    </div>
  );
};

export default App;
