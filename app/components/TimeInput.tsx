"use client";

import { useState, useTransition, useEffect } from "react";
import { updateValueAction } from "../actions";

interface TimeInputProps {
  initialValue?: string; // TIME format string "HH:MM:SS"
  id: string;
}

export default function TimeInput({
  initialValue = "00:00:00",
  id,
}: TimeInputProps) {
  // Ensure the time string is in HH:MM:SS format
  const formatTimeString = (timeString: string): string => {
    if (!timeString) return "00:00:00";

    // If it's already in HH:MM:SS format, return as is
    if (timeString.length === 8 && timeString.includes(":")) {
      return timeString;
    }

    // If it's in HH:MM format, add :00
    if (timeString.length === 5 && timeString.includes(":")) {
      return `${timeString}:00`;
    }

    return "00:00:00";
  };

  const [timeValue, setTimeValue] = useState(formatTimeString(initialValue));
  const [isPending, startTransition] = useTransition();

  // Update the time value when initialValue changes (e.g., when growth cycle changes)
  useEffect(() => {
    setTimeValue(formatTimeString(initialValue));
  }, [initialValue]);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTimeString = e.target.value;
    const formattedTime = formatTimeString(newTimeString);
    setTimeValue(formattedTime);

    // Update database using existing server action
    startTransition(async () => {
      try {
        await updateValueAction(id, formattedTime);
        console.log(`Successfully updated ${id} to ${formattedTime}`);
      } catch (error) {
        console.error("Failed to update time value:", error);
        // Revert the value on error
        setTimeValue(formatTimeString(initialValue));
      }
    });
  };

  const addMinutes = (minutes: number) => {
    const [hours, mins, seconds] = timeValue.split(":").map(Number);
    let totalMinutes = hours * 60 + mins + minutes;

    // Handle overflow/underflow
    if (totalMinutes >= 1440) totalMinutes = 1439; // Max 23:59
    if (totalMinutes < 0) totalMinutes = 0; // Min 00:00

    const newHours = Math.floor(totalMinutes / 60);
    const newMins = totalMinutes % 60;
    const newTimeString = `${newHours.toString().padStart(2, "0")}:${newMins
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    setTimeValue(newTimeString);

    startTransition(async () => {
      try {
        await updateValueAction(id, newTimeString);
        console.log(`Successfully updated ${id} to ${newTimeString}`);
      } catch (error) {
        console.error("Failed to update time value:", error);
        setTimeValue(timeValue); // Revert on error
      }
    });
  };

  const increment15Min = () => addMinutes(15);
  const decrement15Min = () => addMinutes(-15);

  return (
    <div className="relative">
      <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
        <button
          onClick={decrement15Min}
          disabled={isPending}
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          type="button"
          title="Decrease by 15 minutes"
        >
          ↓
        </button>

        <input
          type="time"
          value={timeValue}
          onChange={handleTimeChange}
          disabled={isPending}
          step="1"
          className="flex-1 px-3 py-2 text-center border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />

        <button
          onClick={increment15Min}
          disabled={isPending}
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          type="button"
          title="Increase by 15 minutes"
        >
          ↑
        </button>
      </div>

      {isPending && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-md">
          <div className="text-sm text-gray-600 font-medium">Updating...</div>
        </div>
      )}
    </div>
  );
}
