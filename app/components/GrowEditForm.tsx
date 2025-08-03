// app/components/GrowEditForm.tsx
"use client";

import { useState, useTransition } from "react";
import { updateRecord } from "../actions";

interface Grow {
  Id: number;
  strain: string;
  grow_notes: string;
  currently_selected: string;
  growth_cycle?: string;
}

interface PartialUpdateData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface GrowEditFormProps {
  grow: Grow;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function GrowEditForm({
  grow,
  onSuccess,
  onCancel,
}: GrowEditFormProps) {
  const [formData, setFormData] = useState<Grow>(grow);
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.strain.trim()) {
      newErrors.strain = "Strain is required";
    }

    // if (
    //   formData.ph_level &&
    //   (formData.ph_level < 0 || formData.ph_level > 14)
    // ) {
    //   newErrors.ph_level = "pH level must be between 0 and 14";
    // }

    // if (formData.ec_level && formData.ec_level < 0) {
    //   newErrors.ec_level = "EC level cannot be negative";
    // }

    // if (
    //   formData.temperature &&
    //   (formData.temperature < -50 || formData.temperature > 150)
    // ) {
    //   newErrors.temperature = "Temperature must be between -50°F and 150°F";
    // }

    // if (
    //   formData.humidity &&
    //   (formData.humidity < 0 || formData.humidity > 100)
    // ) {
    //   newErrors.humidity = "Humidity must be between 0% and 100%";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? value === ""
            ? undefined
            : parseFloat(value)
          : value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    startTransition(async () => {
      try {
        // Prepare data for update (exclude Id and convert undefined to null)
        const dataToUpdate: PartialUpdateData = {};

        Object.keys(formData).forEach((key) => {
          if (key !== "Id") {
            const value = formData[key as keyof Grow];
            dataToUpdate[key] = value === undefined ? null : value;
          }
        });

        const result = await updateRecord(
          formData.Id.toString(),
          "grows",
          dataToUpdate
        );

        if (result.success) {
          setSuccessMessage("Grow details updated successfully!");
          setErrors({});

          // Call success callback after a brief delay to show success message
          setTimeout(() => {
            onSuccess?.();
          }, 1500);
        } else {
          setErrors({
            submit: result.error || "Failed to update grow details",
          });
        }
      } catch (error) {
        console.error("Error updating grow:", error);
        setErrors({ submit: "An unexpected error occurred" });
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Edit Grow Details</h2>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            disabled={isPending}
          >
            Cancel
          </button>
        )}
      </div>

      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}

      {errors.submit && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="strain"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Strain *
            </label>
            <input
              type="text"
              id="strain"
              name="strain"
              value={formData.strain}
              onChange={handleInputChange}
              disabled={isPending}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.strain ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter strain name"
            />
            {errors.strain && (
              <p className="mt-1 text-sm text-red-600">{errors.strain}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="growth_cycle"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Growth Cycle
            </label>
            <select
              id="growth_cycle"
              name="growth_cycle"
              value={formData.growth_cycle || ""}
              onChange={handleInputChange}
              disabled={isPending}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select growth cycle</option>
              <option value="veg_growth">Vegetative Growth</option>
              <option value="gen_flower_start">Generative Flower Start</option>
              <option value="veg_flower_mid">Vegetative Flower Middle</option>
              <option value="gen_flower_end">Generative Flower End</option>
            </select>
          </div>
        </div>

        {/* Dates */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="start_date"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Start Date
            </label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={formData.start_date || ""}
              onChange={handleInputChange}
              disabled={isPending}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="expected_harvest"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Expected Harvest
            </label>
            <input
              type="date"
              id="expected_harvest"
              name="expected_harvest"
              value={formData.expected_harvest || ""}
              onChange={handleInputChange}
              disabled={isPending}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div> */}

        {/* Growing Medium and Nutrients */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="medium"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Growing Medium
            </label>
            <select
              id="medium"
              name="medium"
              value={formData.medium || ""}
              onChange={handleInputChange}
              disabled={isPending}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select medium</option>
              <option value="soil">Soil</option>
              <option value="coco">Coco Coir</option>
              <option value="hydro">Hydroponic</option>
              <option value="soilless">Soilless Mix</option>
              <option value="rockwool">Rockwool</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="nutrients"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nutrient Line
            </label>
            <input
              type="text"
              id="nutrients"
              name="nutrients"
              value={formData.nutrients || ""}
              onChange={handleInputChange}
              disabled={isPending}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., General Hydroponics, Advanced Nutrients"
            />
          </div>
        </div> */}

        {/* Environmental Parameters */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label
              htmlFor="ph_level"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              pH Level
            </label>
            <input
              type="number"
              id="ph_level"
              name="ph_level"
              value={formData.ph_level || ""}
              onChange={handleInputChange}
              disabled={isPending}
              step="0.1"
              min="0"
              max="14"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.ph_level ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="6.0"
            />
            {errors.ph_level && (
              <p className="mt-1 text-sm text-red-600">{errors.ph_level}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="ec_level"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              EC Level
            </label>
            <input
              type="number"
              id="ec_level"
              name="ec_level"
              value={formData.ec_level || ""}
              onChange={handleInputChange}
              disabled={isPending}
              step="0.1"
              min="0"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.ec_level ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="1.2"
            />
            {errors.ec_level && (
              <p className="mt-1 text-sm text-red-600">{errors.ec_level}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="temperature"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Temperature (°F)
            </label>
            <input
              type="number"
              id="temperature"
              name="temperature"
              value={formData.temperature || ""}
              onChange={handleInputChange}
              disabled={isPending}
              min="-50"
              max="150"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.temperature ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="75"
            />
            {errors.temperature && (
              <p className="mt-1 text-sm text-red-600">{errors.temperature}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="humidity"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Humidity (%)
            </label>
            <input
              type="number"
              id="humidity"
              name="humidity"
              value={formData.humidity || ""}
              onChange={handleInputChange}
              disabled={isPending}
              min="0"
              max="100"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.humidity ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="60"
            />
            {errors.humidity && (
              <p className="mt-1 text-sm text-red-600">{errors.humidity}</p>
            )}
          </div>
        </div> */}

        {/* Currently Selected Toggle */}
        <div>
          <label
            htmlFor="currently_selected"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Currently Selected
          </label>
          <select
            id="currently_selected"
            name="currently_selected"
            value={formData.currently_selected}
            onChange={handleInputChange}
            disabled={isPending}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>

        {/* Grow Notes */}
        <div>
          <label
            htmlFor="grow_notes"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Grow Notes
          </label>
          <textarea
            id="grow_notes"
            name="grow_notes"
            value={formData.grow_notes}
            onChange={handleInputChange}
            disabled={isPending}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter detailed notes about this grow..."
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Updating...
              </span>
            ) : (
              "Update Grow Details"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
