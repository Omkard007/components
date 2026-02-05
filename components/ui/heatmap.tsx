import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

import { HTMLAttributes, ReactNode } from "react";

export type HeatmapValue = {
  date: string; // YYYY-MM-DD
  value: number;
};

export type HeatmapData = HeatmapValue[];

type InterpolationModes = "linear" | "sqrt" | "log";

type ColorOptions =
  | {
      colorMode: "discrete";
      colorScale?: string[];
      customColorMap?: (
        value: number,
        max: number,
        colorCount: number
      ) => number;
    }
  | {
      colorMode: "interpolate";
      maxColor?: string;
      minColor?: string;
      interpolation?: InterpolationModes;
    };

type HeatmapProps = HTMLAttributes<HTMLDivElement> &
  ColorOptions & {
    data: HeatmapData;
    startDate: Date;
    endDate: Date;
    cellSize?: number;
    gap?: number;
    daysOfTheWeek?: "all" | "MWF" | "none" | "single letter";
    displayStyle?: "squares" | "bubbles";
    dateDisplayFunction?: (date: Date) => ReactNode;
    valueDisplayFunction?: (value: number) => ReactNode;
  };

function getAllDays(start: string, end: string): string[] {
  // Generate all days between start and end dates (inclusive)
  const days: string[] = [];
  let curr = new Date(start + "T00:00:00");

  const endDate = new Date(end + "T00:00:00");

  while (curr <= endDate) {
    days.push(formatLocalDate(curr));
    curr.setDate(curr.getDate() + 1);
  }

  return days;
}

function padToWeekStart(days: string[]): (string | null)[] {
  // Pad the start of the days array with nulls to align to week start (Sunday)
  // eg. if first day is Wednesday (3), add 3 nulls at start
  const firstDay = new Date(days[0] + "T00:00:00").getDay();
  const padding = new Array(firstDay).fill(null);
  return [...padding, ...days];
}

function chunkByWeek(days: (string | null)[]): (string | null)[][] {
  // Chunk the days into weeks (arrays of 7 days)
  const weeks: (string | null)[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
}

function getMonthLabel(week: (string | null)[], weekIndex: number, allWeeks: (string | null)[][]) {
  // Get month label for the week (based on first non-null day)
  const firstDay = week.find(Boolean);
  if (!firstDay) return null;
  
  const currentMonth = new Date(firstDay + "T00:00:00").toLocaleString("default", {
    month: "short"
  });
  
  // Check if this is a different month from the previous week
  if (weekIndex === 0) return currentMonth;
  
  const prevWeek = allWeeks[weekIndex - 1];
  const prevFirstDay = prevWeek.find(Boolean);
  if (!prevFirstDay) return currentMonth;
  
  const prevMonth = new Date(prevFirstDay + "T00:00:00").toLocaleString("default", {
    month: "short"
  });
  
  return currentMonth !== prevMonth ? currentMonth : null;
}

function defaultColourMap(value: number, max: number, colorCount: number) {
  // Map value to color index
  // default: we do a linear scale from 0 to max
  if (colorCount <= 0) return 0; // safeguard
  if (max <= 0 || value <= 0) return 0; // all zero values
  const index = Math.ceil((value / max) * (colorCount - 1));
  return Math.min(Math.max(index, 0), colorCount - 1);
}

function interpolateRgb(
  value: number,
  max: number,
  minColor: string,
  maxColor: string,
  scale: InterpolationModes
) {
  if (value <= 0 || max <= 0) return minColor;

  let t = value / max;

  switch (scale) {
    case "sqrt":
      t = Math.sqrt(t);
      break;
    case "log":
      t = Math.log10(value + 1) / Math.log10(max + 1);
      break;
  }

  // Clamp t between 0 and 1
  t = Math.min(Math.max(t, 0), 1);

  const s = {
    r: parseInt(minColor.slice(1, 3), 16),
    g: parseInt(minColor.slice(3, 5), 16),
    b: parseInt(minColor.slice(5, 7), 16)
  };

  const e = {
    r: parseInt(maxColor.slice(1, 3), 16),
    g: parseInt(maxColor.slice(3, 5), 16),
    b: parseInt(maxColor.slice(5, 7), 16)
  };

  const r = Math.round(s.r + (e.r - s.r) * t);
  const g = Math.round(s.g + (e.g - s.g) * t);
  const b = Math.round(s.b + (e.b - s.b) * t);

  return `rgb(${r}, ${g}, ${b})`;
}

// GitHub-style colors (dark theme)
const defaultIntensityColours = [
  "#161b22", // No contributions (dark gray)
  "#0e4429", // Low contributions
  "#006d32", // Medium-low contributions
  "#26a641", // Medium-high contributions
  "#39d353"  // High contributions
];

const daysOfTheWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface DaysOfTheWeekIndicatorProps {
  daysOfTheWeekOption: "all" | "MWF" | "none" | "single letter";
  fontSize: number;
}

function daysOfTheWeekIndicator({
  daysOfTheWeekOption,
  fontSize
}: DaysOfTheWeekIndicatorProps) {
  if (daysOfTheWeekOption === "none") return null;

  return daysOfTheWeek.map((day, i) =>
    daysOfTheWeekOption === "MWF" && ![1, 3, 5].includes(i) ? (
      <div
        key={i}
        style={{
          gridRow: i + 2,
          gridColumn: 1
        }}
      />
    ) : (
      <div
        key={i}
        className="flex items-center"
        style={{
          gridRow: i + 2,
          gridColumn: 1,
          justifyContent: "flex-end",
          fontSize,
          color: "#8b949e" // GitHub gray text color
        }}
      >
        {daysOfTheWeekOption === "single letter" ? day.charAt(0) : day}
      </div>
    )
  );
}

interface ValueIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  cellSize: number;
  displayStyle: "squares" | "bubbles";
  value: number; // current cell value
  maxValue: number; // maximum possible value out of all cells
  color: string;
}

function ValueIndicator({
  cellSize,
  displayStyle,
  value,
  maxValue,
  color,
  style,
  ...htmlProps
}: ValueIndicatorProps) {
  let finalSize = cellSize;

  if (displayStyle === "bubbles") {
    // Min bubble size = 0.3 * size, Max bubble size = size
    const minScale = 0.3;
    const scale = maxValue > 0 ? value / maxValue : 0;
    finalSize = cellSize * (minScale + (1 - minScale) * scale);

    return (
      <div
        className="flex items-center justify-center"
        style={style}
        {...htmlProps}
      >
        <span
          className="transition-colors rounded-sm"
          style={{
            width: finalSize,
            height: finalSize,
            backgroundColor: color
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="transition-colors rounded-sm"
      style={{
        borderRadius: 2,
        backgroundColor: color,
        ...style
      }}
      {...htmlProps}
    />
  );
}

export function Heatmap(props: HeatmapProps) {
  const {
    data,
    startDate,
    endDate,
    cellSize = 12,
    daysOfTheWeek = "MWF",
    gap = 3,
    displayStyle = "squares",
    valueDisplayFunction,
    dateDisplayFunction,
    className,
    colorMode
  } = props;

  const valueByDate = new Map<string, number>(
    data.map(({ date, value }) => [date, value])
  );

  const days = getAllDays(formatLocalDate(startDate), formatLocalDate(endDate));
  const paddedDays = padToWeekStart(days);
  const weeks = chunkByWeek(paddedDays);

  const maxValue = Math.max(...data.map((d) => d.value), 0);

  const monthLabels = weeks.map((week, i) => {
    return getMonthLabel(week, i, weeks);
  });

  const fontSize = Math.min(12, cellSize);

  let safeProps: HTMLAttributes<HTMLDivElement> = {};

  if (colorMode === "discrete") {
    const {
      data,
      startDate,
      endDate,
      cellSize,
      daysOfTheWeek,
      gap,
      displayStyle,
      valueDisplayFunction,
      dateDisplayFunction,
      className,
      colorMode,
      customColorMap,
      colorScale,
      ...others
    } = props;
    safeProps = others;
  } else if (colorMode === "interpolate") {
    const {
      data,
      startDate,
      endDate,
      cellSize,
      daysOfTheWeek,
      gap,
      displayStyle,
      valueDisplayFunction,
      dateDisplayFunction,
      className,
      colorMode,
      minColor,
      maxColor,
      interpolation,
      ...others
    } = props;
    safeProps = others;
  }

  const getCellColor = (value: number) => {
    if (colorMode === "interpolate") {
      if (value <= 0) {
        return props.minColor ?? "#161b22";
      }

      // 0 < value <= maxValue
      // interpolate between minColor and maxColor
      return interpolateRgb(
        value,
        maxValue,
        props.minColor ?? "#0e4429",
        props.maxColor ?? "#39d353",
        props.interpolation ?? "linear"
      );
    } else {
      const colorArray =
        props.colorScale && props.colorScale.length > 0
          ? props.colorScale
          : defaultIntensityColours;

      const map = props.customColorMap ?? defaultColourMap;

      return colorArray[map(value, maxValue, colorArray.length)];
    }
  };

  return (
    <div
      role="grid"
      className={cn("p-6 rounded-lg", className)}
      aria-label="Activity Heatmap"
      style={{
        backgroundColor: "#0d1117", // GitHub dark background
        border: "1px solid #30363d" // GitHub border color
      }}
      {...safeProps}
    >
      <div
        className="grid"
        style={{
          gap,
          gridTemplateColumns: `max-content repeat(${weeks.length}, ${cellSize}px)`,
          gridTemplateRows: `repeat(8, ${cellSize}px)`
        }}
      >
        {daysOfTheWeekIndicator({ daysOfTheWeekOption: daysOfTheWeek, fontSize })}

        {weeks.map((_, i) => (
          <div
            key={`header-${i}`}
            style={{ 
              gridColumn: i + 2, 
              gridRow: 1, 
              fontSize,
              color: "#8b949e" // GitHub gray text color
            }}
            className="flex items-end"
          >
            {monthLabels[i]}
          </div>
        ))}

        <TooltipProvider>
          {weeks.map((week, weekIdx) =>
            week.map((day, dayIdx) => {
              if (!day) {
                return (
                  <div
                    key={dayIdx}
                    style={{ gridColumn: weekIdx + 2, gridRow: dayIdx + 2 }}
                  />
                );
              }

              const thisDateValue = valueByDate.get(day) ?? 0;
              const safeValue = Math.max(0, thisDateValue);
              const thisColor = getCellColor(safeValue);
              const dateForDisplay = new Date(day + "T00:00:00");

              return (
                <Tooltip key={dayIdx}>
                  <TooltipTrigger asChild>
                    <ValueIndicator
                      style={{ gridColumn: weekIdx + 2, gridRow: dayIdx + 2 }}
                      tabIndex={0}
                      aria-label={`${day}: ${safeValue} contribution${safeValue !== 1 ? "s" : ""}`}
                      id={`heatmap-cell-${day}`}
                      cellSize={cellSize}
                      displayStyle={displayStyle}
                      value={safeValue}
                      maxValue={maxValue}
                      color={thisColor}
                    />
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-900 border-gray-700">
                    <div className="text-xs">
                      <div className="text-white">
                        {dateDisplayFunction
                          ? dateDisplayFunction(dateForDisplay)
                          : dateForDisplay.toDateString()}
                      </div>
                      <div className="text-gray-400">
                        {valueDisplayFunction
                          ? valueDisplayFunction(safeValue)
                          : `${safeValue} contribution${safeValue !== 1 ? "s" : ""}`}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })
          )}
        </TooltipProvider>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-4">
        <span className="text-xs" style={{ color: "#8b949e" }}>Less</span>
        {defaultIntensityColours.map((color, i) => (
          <div
            key={i}
            className="rounded-sm"
            style={{
              width: cellSize,
              height: cellSize,
              backgroundColor: color
            }}
          />
        ))}
        <span className="text-xs" style={{ color: "#8b949e" }}>More</span>
      </div>
    </div>
  );
}

function formatLocalDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}