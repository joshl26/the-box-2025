"use client";

import { useState, useTransition, useEffect } from "react";
import { updateValueAction } from "../actions";

interface NumberInputProps {
  initialValue?: number;
  id: string;
  min?: number;
  max?: number;
  step?: number;
}

export default function NumberInput({
  initialValue = 0,
  id,
  min,
  max,
  step = 1,
}: NumberInputProps) {
  const [value, setValue] = useState(initialValue);
  const [isPending, startTransition] = useTransition();

  // Update the value when initialValue changes (e.g., when growth cycle changes)
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = (newValue: number) => {
    // Apply min/max constraints
    if (min !== undefined && newValue < min) newValue = min;
    if (max !== undefined && newValue > max) newValue = max;

    setValue(newValue);

    // Update database using existing server action
    startTransition(async () => {
      try {
        await updateValueAction(id, newValue);
        console.log(`Successfully updated ${id} to ${newValue}`);
      } catch (error) {
        console.error("Failed to update value:", error);
        // Revert the value on error
        setValue(initialValue);
      }
    });
  };

  const increment = () => handleChange(value + step);
  const decrement = () => handleChange(value - step);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || 0;
    handleChange(newValue);
  };

  return (
    <div className="relative">
      <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
        <button
          onClick={decrement}
          disabled={isPending || (min !== undefined && value <= min)}
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          type="button"
        >
          ↓
        </button>

        <input
          type="number"
          value={value}
          onChange={handleInputChange}
          disabled={isPending}
          className="flex-1 px-3 py-2 text-center border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          min={min}
          max={max}
          step={step}
        />

        <button
          onClick={increment}
          disabled={isPending || (max !== undefined && value >= max)}
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          type="button"
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
