// app/components/SensorDataGraph.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface SensorReading {
  time: string;
  sensor_id: number;
  value: number;
  metadata: {
    location?: string;
    plant_type?: string;
    irrigation_cycle?: number;
    irrigation_event?: boolean;
  };
}

interface SensorStats {
  average: string;
  minimum: number;
  maximum: number;
  readingCount: number;
}

interface SensorDataGraphProps {
  sensorId?: number;
  hoursBack?: number;
  refreshInterval?: number; // milliseconds
  height?: number;
}

export default function SensorDataGraph({
  sensorId = 101,
  hoursBack = 24,
  refreshInterval = 30000, // 30 seconds
  height = 700,
}: SensorDataGraphProps) {
  const [sensorData, setSensorData] = useState<SensorReading[]>([]);
  const [latestReading, setLatestReading] = useState<SensorReading | null>(
    null
  );
  const [stats, setStats] = useState<SensorStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchData = async () => {
    try {
      const [dataResponse, latestResponse, statsResponse] = await Promise.all([
        fetch(`/api/sensor-data?sensorId=${sensorId}&hoursBack=${hoursBack}`, {
          cache: "no-store",
        }),
        fetch(`/api/sensor-data/latest?sensorId=${sensorId}`, {
          cache: "no-store",
        }),
        fetch(
          `/api/sensor-data/stats?sensorId=${sensorId}&hoursBack=${hoursBack}`,
          {
            cache: "no-store",
          }
        ),
      ]);

      if (!dataResponse.ok || !latestResponse.ok || !statsResponse.ok) {
        throw new Error("Failed to fetch sensor data");
      }

      const dataResult = await dataResponse.json();
      const latestResult = await latestResponse.json();
      const statsResult = await statsResponse.json();

      console.log(dataResult.sensorData);
      console.log(latestResult);

      if (dataResult.success) {
        setSensorData(dataResult.sensorData);
      }

      if (latestResult.success) {
        setLatestReading(latestResult.latestReading);
      }

      if (statsResult.success) {
        setStats(statsResult.stats);
      }

      setLastUpdated(new Date().toLocaleTimeString());
      setError(null);
    } catch (err) {
      console.error("Error fetching sensor data:", err);
      setError("Failed to load sensor data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [sensorId, hoursBack, refreshInterval]);

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatTooltipTime = (timeString: string) => {
    return new Date(timeString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getMoistureStatus = (value: number) => {
    if (value >= 580)
      return {
        status: "Optimal",
        color: "text-green-600",
        bgColor: "bg-green-100",
      };
    if (value >= 550)
      return { status: "Good", color: "text-blue-600", bgColor: "bg-blue-100" };
    if (value >= 520)
      return {
        status: "Low",
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
      };
    return { status: "Critical", color: "text-red-600", bgColor: "bg-red-100" };
  };

  const irrigationEvents = sensorData.filter(
    (reading) => reading.metadata.irrigation_event
  );

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-4"></div>
          <div className="h-80 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="text-center text-red-600">
          <svg
            className="mx-auto h-12 w-12 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <h3 className="text-lg font-medium mb-2">
            Unable to Load Sensor Data
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const currentStatus = latestReading
    ? getMoistureStatus(latestReading.value)
    : null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Soil Moisture - Sensor {sensorId}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {latestReading?.metadata.location &&
              `Location: ${latestReading.metadata.location}`}
            {latestReading?.metadata.plant_type &&
              ` • Plant: ${latestReading.metadata.plant_type}`}
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {lastUpdated}
          </div>
          <div className="flex items-center mt-1">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm text-green-600 dark:text-green-400">
              Live
            </span>
          </div>
        </div>
      </div>

      {/* Current Status Cards */}
      {latestReading && stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Current Value
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {latestReading.value.toFixed(1)}
            </div>
            {currentStatus && (
              <div
                className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${currentStatus.bgColor} ${currentStatus.color}`}
              >
                {currentStatus.status}
              </div>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              24h Average
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.average}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Range
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {stats.minimum} - {stats.maximum}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Readings
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.readingCount}
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div style={{ width: "100%", height: height }}>
        <ResponsiveContainer>
          <LineChart
            data={sensorData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#374151"
              opacity={0.3}
            />
            <XAxis
              dataKey="time"
              tickFormatter={formatTime}
              stroke="#6B7280"
              fontSize={12}
              tickCount={8}
            />
            <YAxis
              domain={["dataMin - 10", "dataMax + 10"]}
              stroke="#6B7280"
              fontSize={12}
            />
            <Tooltip
              labelFormatter={(value: string) =>
                `Time: ${formatTooltipTime(value as string)}`
              }
              formatter={(value: number) => [
                `${value.toFixed(1)}`,
                "Moisture Level",
              ]}
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "6px",
                color: "#F9FAFB",
              }}
            />

            {/* Reference lines for moisture thresholds */}
            <ReferenceLine
              y={500}
              stroke="#EF4444"
              strokeDasharray="5 5"
              label="Critical"
            />
            <ReferenceLine
              y={520}
              stroke="#F59E0B"
              strokeDasharray="5 5"
              label="Low"
            />
            <ReferenceLine
              y={550}
              stroke="#3B82F6"
              strokeDasharray="5 5"
              label="Good"
            />
            <ReferenceLine
              y={580}
              stroke="#10B981"
              strokeDasharray="5 5"
              label="Optimal"
            />

            {/* Main data line */}
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 4,
                stroke: "#8B5CF6",
                strokeWidth: 2,
                fill: "#8B5CF6",
              }}
            />

            {/* Irrigation event markers */}
            {irrigationEvents.map((event, index) => (
              <ReferenceLine
                key={index}
                x={event.time}
                stroke="#06B6D4"
                strokeWidth={2}
                label={{ value: "💧", position: "top" }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center">
          <div className="w-4 h-0.5 bg-purple-500 mr-2"></div>
          Moisture Level
        </div>
        <div className="flex items-center">
          <div className="w-4 h-0.5 bg-cyan-500 mr-2"></div>
          💧 Irrigation Events
        </div>
        <div className="flex items-center">
          <div className="w-4 h-0.5 bg-green-500 mr-2"></div>
          Optimal (580+)
        </div>
        <div className="flex items-center">
          <div className="w-4 h-0.5 bg-red-500 mr-2"></div>
          Critical (500-)
        </div>
      </div>
    </div>
  );
}
