// app/components/EditGrowForm.tsx
import { updateRecord } from "../actions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface Grow {
  id: number;
  strain: string;
  grow_notes: string;
  currently_selected: string;
  sunrise_time_veg?: string;
  sunset_time_veg?: string;
  sunrise_time_flower?: string;
  sunset_time_flower?: string;
  number_of_pots?: number;
  pot_volume?: number;
  vegetative_start_date?: string;
  flower_start_date?: string;
  flower_end_date?: string;
  breeder_name?: string;
  grower_name?: string;
  grow_finished?: string;
}

interface EditGrowFormProps {
  grow: Grow;
}

interface PartialUpdateData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export default function EditGrowForm({ grow }: EditGrowFormProps) {
  const formatDateForInput = (
    date: Date | string | null | undefined
  ): string => {
    if (!date) return "";
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toISOString().split("T")[0];
  };

  const handleUpdate = async (formData: FormData) => {
    "use server";

    try {
      const id = formData.get("id") as string;
      const strain = formData.get("strain") as string;
      const grow_notes = formData.get("grow_notes") as string;
      const currently_selected = formData.get("currently_selected") as string;
      const sunrise_time_veg = formData.get("sunrise_time_veg") as string;
      const sunset_time_veg = formData.get("sunset_time_veg") as string;
      const sunrise_time_flower = formData.get("sunrise_time_flower") as string;
      const sunset_time_flower = formData.get("sunset_time_flower") as string;
      const number_of_pots = formData.get("number_of_pots") as string;
      const pot_volume = formData.get("pot_volume") as string;
      const vegetative_start_date = formData.get(
        "vegetative_start_date"
      ) as string;
      const flower_start_date = formData.get("flower_start_date") as string;
      const flower_end_date = formData.get("flower_end_date") as string;
      const breeder_name = formData.get("breeder_name") as string;
      const grower_name = formData.get("grower_name") as string;

      // Fix for checkbox: Get all values and check if checkbox is checked
      const grow_finished_values = formData.getAll("grow_finished") as string[];
      const grow_finished = grow_finished_values.includes("true")
        ? "true"
        : "false";

      const dataToUpdate: PartialUpdateData = {};

      if (strain) dataToUpdate.strain = strain;
      if (grow_notes) dataToUpdate.grow_notes = grow_notes;
      if (currently_selected)
        dataToUpdate.currently_selected = currently_selected;
      if (sunrise_time_veg) dataToUpdate.sunrise_time_veg = sunrise_time_veg;
      if (sunset_time_veg) dataToUpdate.sunset_time_veg = sunset_time_veg;
      if (sunrise_time_flower)
        dataToUpdate.sunrise_time_flower = sunrise_time_flower;
      if (sunset_time_flower)
        dataToUpdate.sunset_time_flower = sunset_time_flower;
      if (number_of_pots)
        dataToUpdate.number_of_pots = parseInt(number_of_pots);
      if (pot_volume) dataToUpdate.pot_volume = parseFloat(pot_volume);
      if (vegetative_start_date)
        dataToUpdate.vegetative_start_date = vegetative_start_date;
      if (flower_start_date) dataToUpdate.flower_start_date = flower_start_date;
      if (flower_end_date) dataToUpdate.flower_end_date = flower_end_date;
      if (breeder_name) dataToUpdate.breeder_name = breeder_name;
      if (grower_name) dataToUpdate.grower_name = grower_name;

      // Always include grow_finished (fixed)
      dataToUpdate.grow_finished = grow_finished;

      const result = await updateRecord(id, "grows", dataToUpdate);

      if (result.success) {
        console.log("Record updated successfully:", result.updatedRecord);

        // Revalidate all relevant paths
        revalidatePath("/dashboard/editGrow");
        revalidatePath("/dashboard");
        revalidatePath("/dashboard/irrigationSchedule");
        revalidatePath("/dashboard/lightingSchedule");

        // Redirect back to the edit page to show updated data
        redirect("/dashboard/editGrow");
      } else {
        console.error("Update failed:", result.error);
        throw new Error(result.error || "Failed to update grow");
      }
    } catch (error) {
      // Handle redirect errors separately from other errors
      if (error && typeof error === "object" && "digest" in error) {
        // This is likely a Next.js redirect, re-throw it
        throw error;
      }

      console.error("Error updating grow:", error);
      throw new Error("Failed to update grow");
    }
  };

  return (
    <div className="max-w-2xl mx-auto shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Edit Grow Details</h2>

      <form action={handleUpdate} className="space-y-4">
        <input type="hidden" name="id" value={grow.id} />

        {/* Basic Information Section */}
        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-medium mb-3">Basic Information</h3>

          {/* Strain Input */}
          <div className="mb-4">
            <label htmlFor="strain" className="block text-sm font-medium mb-1">
              Strain
            </label>
            <input
              type="text"
              id="strain"
              name="strain"
              defaultValue={grow.strain}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter strain name"
            />
          </div>

          {/* Grow Notes Input */}
          <div className="mb-4">
            <label
              htmlFor="grow_notes"
              className="block text-sm font-medium mb-1"
            >
              Grow Notes
            </label>
            <textarea
              id="grow_notes"
              name="grow_notes"
              defaultValue={grow.grow_notes}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              placeholder="Enter grow notes"
            />
          </div>

          {/* Breeder Name Input */}
          <div className="mb-4">
            <label
              htmlFor="breeder_name"
              className="block text-sm font-medium mb-1"
            >
              Breeder Name
            </label>
            <input
              type="text"
              id="breeder_name"
              name="breeder_name"
              defaultValue={grow.breeder_name || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter breeder name"
            />
          </div>

          {/* Grower Name Input */}
          <div className="mb-4">
            <label
              htmlFor="grower_name"
              className="block text-sm font-medium mb-1"
            >
              Grower Name
            </label>
            <input
              type="text"
              id="grower_name"
              name="grower_name"
              defaultValue={grow.grower_name || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter grower name"
            />
          </div>

          {/* Currently Selected Input */}
          <div>
            <label
              htmlFor="currently_selected"
              className="block text-sm font-medium mb-1"
            >
              Currently Selected
            </label>
            <select
              id="currently_selected"
              name="currently_selected"
              defaultValue={grow.currently_selected}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>

        {/* Lighting Schedule Section */}
        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-medium mb-3">Lighting Schedule</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vegetative Stage Times */}
            <div>
              <h4 className="text-md font-medium mb-2 text-green-600">
                Vegetative Stage
              </h4>

              <div className="mb-3">
                <label
                  htmlFor="sunrise_time_veg"
                  className="block text-sm font-medium mb-1"
                >
                  Sunrise Time (Veg)
                </label>
                <input
                  type="time"
                  id="sunrise_time_veg"
                  name="sunrise_time_veg"
                  defaultValue={grow.sunrise_time_veg || ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="sunset_time_veg"
                  className="block text-sm font-medium mb-1"
                >
                  Sunset Time (Veg)
                </label>
                <input
                  type="time"
                  id="sunset_time_veg"
                  name="sunset_time_veg"
                  defaultValue={grow.sunset_time_veg || ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Flowering Stage Times */}
            <div>
              <h4 className="text-md font-medium mb-2 text-purple-600">
                Flowering Stage
              </h4>

              <div className="mb-3">
                <label
                  htmlFor="sunrise_time_flower"
                  className="block text-sm font-medium mb-1"
                >
                  Sunrise Time (Flower)
                </label>
                <input
                  type="time"
                  id="sunrise_time_flower"
                  name="sunrise_time_flower"
                  defaultValue={grow.sunrise_time_flower || ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="sunset_time_flower"
                  className="block text-sm font-medium mb-1"
                >
                  Sunset Time (Flower)
                </label>
                <input
                  type="time"
                  id="sunset_time_flower"
                  name="sunset_time_flower"
                  defaultValue={grow.sunset_time_flower || ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Setup Configuration Section */}
        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-medium mb-3">Setup Configuration</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Number of Pots */}
            <div>
              <label
                htmlFor="number_of_pots"
                className="block text-sm font-medium mb-1"
              >
                Number of Pots
              </label>
              <input
                type="number"
                id="number_of_pots"
                name="number_of_pots"
                defaultValue={grow.number_of_pots || ""}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. 4"
              />
            </div>

            {/* Pot Volume */}
            <div>
              <label
                htmlFor="pot_volume"
                className="block text-sm font-medium mb-1"
              >
                Pot Volume (Milliliters)
              </label>
              <input
                type="number"
                id="pot_volume"
                name="pot_volume"
                defaultValue={grow.pot_volume || ""}
                min="0"
                step="10"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. 11.5"
              />
            </div>
          </div>
        </div>

        {/* Grow Timeline Section */}
        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-medium mb-3">Grow Timeline</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vegetative Start Date */}
            <div>
              <label
                htmlFor="vegetative_start_date"
                className="block text-sm font-medium mb-1"
              >
                Vegetative Start Date
              </label>
              <input
                type="date"
                id="vegetative_start_date"
                name="vegetative_start_date"
                defaultValue={formatDateForInput(grow?.vegetative_start_date)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Flower Start Date */}
            <div>
              <label
                htmlFor="flower_start_date"
                className="block text-sm font-medium mb-1"
              >
                Flower Start Date
              </label>
              <input
                type="date"
                id="flower_start_date"
                name="flower_start_date"
                defaultValue={formatDateForInput(grow?.flower_start_date)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Flower End Date */}
            <div>
              <label
                htmlFor="flower_end_date"
                className="block text-sm font-medium mb-1"
              >
                Flower End Date
              </label>
              <input
                type="date"
                id="flower_end_date"
                name="flower_end_date"
                defaultValue={formatDateForInput(grow?.flower_end_date)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Grow Finished Checkbox */}
          <div className="mt-4">
            <label className="flex items-center">
              <input type="hidden" name="grow_finished" value="false" />
              <input
                type="checkbox"
                name="grow_finished"
                value="true"
                defaultChecked={grow.grow_finished === "true"}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium">Grow Finished</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        >
          Update Grow Details
        </button>
      </form>
    </div>
  );
}
