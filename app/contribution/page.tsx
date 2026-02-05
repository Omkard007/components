import { Heatmap, 
    type HeatmapData
  } from "@/components/ui/heatmap";
  import { useMemo } from "react";
  
  function generateRandomHeatmapData(
    startDate: Date,
    endDate: Date,
    minValue: number = 0,
    maxValue: number = 30
  ): HeatmapData {
    const data: HeatmapData = [];
    const current = new Date(startDate);
  
    while (current <= endDate) {
      const dateString = current.toISOString().slice(0, 10);
      const value =
        Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
      data.push({ date: dateString, value });
      current.setDate(current.getDate() + 1);
    }
  
    return data;
  }
  
  export default function contribution() {
    const data = useMemo(
      () =>
        generateRandomHeatmapData(
          new Date("2025-01-01"),
          new Date("2025-12-31"),  // Changed from 06-30 to 12-31 to show full year
          0,
          30
        ),
      []
    );
  
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <Heatmap
          data={data}
          startDate={new Date("2025-01-01")}
          endDate={new Date("2025-12-31")}  // Changed from 06-30 to 12-31 to show full year
          colorMode="interpolate"
        />
      </main>
    );
  }