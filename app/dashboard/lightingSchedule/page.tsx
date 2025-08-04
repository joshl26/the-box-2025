// app/components/LightingScheduleForm.tsx
import { fetchCurrentlySelectedGrow, updateRecord } from "../../actions";

interface PartialUpdateData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export default async function LightingScheduleForm() {
  const currentlySelected = await fetchCurrentlySelectedGrow();

  if (
    !currentlySelected.success ||
    !currentlySelected.fetchCurrentlySelectedGrow
  ) {
    return (
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-red-600">Error</h2>
        <p>No currently selected grow found or failed to fetch data.</p>
      </div>
    );
  }

  const grow = currentlySelected.fetchCurrentlySelectedGrow;

  const handleUpdate = async (formData: FormData) => {
    "use server";

    const Id = formData.get("Id") as string;
    const sunrise_time_veg = formData.get("sunrise_time_veg") as string;
    const sunset_time_veg = formData.get("sunset_time_veg") as string;
    const sunrise_time_flower = formData.get("sunrise_time_flower") as string;
    const sunset_time_flower = formData.get("sunset_time_flower") as string;

    const dataToUpdate: PartialUpdateData = {};

    if (sunrise_time_veg)
      dataToUpdate.sunrise_time_veg = parseInt(sunrise_time_veg);
    if (sunset_time_veg)
      dataToUpdate.sunset_time_veg = parseInt(sunset_time_veg);
    if (sunrise_time_flower)
      dataToUpdate.sunrise_time_flower = parseInt(sunrise_time_flower);
    if (sunset_time_flower)
      dataToUpdate.sunset_time_flower = parseInt(sunset_time_flower);

    const result = await updateRecord(Id, "grows", dataToUpdate);

    if (result.success) {
      console.log(
        "Lighting schedule updated successfully:",
        result.updatedRecord
      );
    } else {
      console.error("Update failed:", result.error);
    }
  };

  // Helper function to convert minutes to HH:MM format
  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  };

  // Helper function to convert HH:MM format to minutes
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  return (
    <div className="max-w-2xl mx-auto  shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6 ">
        Lighting Schedule - {grow.strain}
      </h2>

      <form action={handleUpdate} className="space-y-8">
        <input type="hidden" name="Id" value={grow.Id} />

        {/* Vegetative Stage */}
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            Vegetative Stage Lighting
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="sunrise_time_veg"
                className="block text-sm font-medium text-black mb-2"
              >
                Sunrise Time (Lights On)
              </label>
              <input
                type="time"
                id="sunrise_time_veg"
                name="sunrise_time_veg"
                defaultValue={minutesToTime(grow.sunrise_time_veg || 420)} // Default 7:00 AM
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
              />
              <p className="text-xs text-black mt-1">
                Current: {minutesToTime(grow.sunrise_time_veg || 420)}
              </p>
            </div>

            <div>
              <label
                htmlFor="sunset_time_veg"
                className="block text-sm font-medium text-black mb-2"
              >
                Sunset Time (Lights Off)
              </label>
              <input
                type="time"
                id="sunset_time_veg"
                name="sunset_time_veg"
                defaultValue={minutesToTime(grow.sunset_time_veg || 1380)} // Default 11:00 PM
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="text-xs text-black mt-1">
                Current: {minutesToTime(grow.sunset_time_veg || 1380)}
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-green-100 rounded-md">
            <p className="text-sm text-green-800">
              <strong>Vegetative Light Cycle:</strong> Typically 18-24 hours of
              light per day for optimal growth.
            </p>
          </div>
        </div>

        {/* Flowering Stage */}
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
            <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
            Flowering Stage Lighting
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="sunrise_time_flower"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Sunrise Time (Lights On)
              </label>
              <input
                type="time"
                id="sunrise_time_flower"
                name="sunrise_time_flower"
                defaultValue={minutesToTime(grow.sunrise_time_flower || 420)} // Default 7:00 AM
                className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Current: {minutesToTime(grow.sunrise_time_flower || 420)}
              </p>
            </div>

            <div>
              <label
                htmlFor="sunset_time_flower"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Sunset Time (Lights Off)
              </label>
              <input
                type="time"
                id="sunset_time_flower"
                name="sunset_time_flower"
                defaultValue={minutesToTime(grow.sunset_time_flower || 1140)} // Default 7:00 PM
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Current: {minutesToTime(grow.sunset_time_flower || 1140)}
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-purple-100 rounded-md">
            <p className="text-sm text-purple-800">
              <strong>Flowering Light Cycle:</strong> Requires exactly 12 hours
              of light and 12 hours of darkness to trigger flowering.
            </p>
          </div>
        </div>

        {/* Current Growth Cycle Indicator */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-blue-800">
                Current Growth Cycle
              </h4>
              <p className="text-lg font-semibold text-blue-900 capitalize">
                {grow.growth_cycle?.replace("_", " ") || "Not Set"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-blue-600">
                Active lighting schedule will depend on current cycle
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
        >
          Update Lighting Schedule
        </button>
      </form>
    </div>
  );
}
