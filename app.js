import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import "chart.js/auto";

const App = () => {
  const [energyData, setEnergyData] = useState([]);
  const [limit, setLimit] = useState(5);
  const [alert, setAlert] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5001/stats")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched data:", data); // ✅ Debugging log
        setEnergyData(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    console.log("Updated energyData:", energyData); // ✅ Check if state updates
    const totalConsumption = energyData.reduce((acc, item) => acc + item.total_consumption, 0);
    setAlert(totalConsumption > limit ? "⚠️ Energy limit exceeded!" : "");
  }, [energyData, limit]);

  const chartData = {
    labels: energyData.map((item) => item.device),
    datasets: [
      {
        label: "Energy Consumption (kWh)",
        data: energyData.map((item) => item.total_consumption),
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="p-6 flex flex-col items-center space-y-6">
      <h1 className="text-2xl font-bold">Smart Home Energy Monitoring</h1>
      <Card className="w-full max-w-lg">
        <CardContent>
          <Line data={chartData} />
          <p className="mt-4 text-lg font-semibold">Energy Limit: {limit} kWh</p>
          <input
            type="number"
            className="border p-2 mt-2 w-full"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          />
          <p className="text-red-500 mt-2">{alert}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;
