// app/components/GrowthCycleRadioButton.tsx

import { fetchCurrentlySelectedGrow, updateRecord } from "../actions";
import { revalidatePath } from "next/cache";

interface PartialUpdateData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export default async function GrowthCycleRadioButton() {
  const currentlySelected = await fetchCurrentlySelectedGrow();

  const selectedGrowthCycle =
    currentlySelected.fetchCurrentlySelectedGrow.growth_cycle;

  const recordId = currentlySelected.fetchCurrentlySelectedGrow.id;

  const handleVegGrowth = async () => {
    "use server";

    const dataToUpdate: PartialUpdateData = {
      growth_cycle: "veg_growth",
    };

    const result = await updateRecord(
      recordId.toString(),
      "grows",
      dataToUpdate
    );

    if (result.success) {
      console.log("Growth cycle updated successfully:", result.updatedRecord);
      revalidatePath("/dashboard/irrigationSchedule");
    } else {
      console.error("Update failed:", result.error);
    }
  };

  const handleGenFlowerStart = async () => {
    "use server";

    const dataToUpdate: PartialUpdateData = {
      growth_cycle: "gen_flower_start",
    };

    const result = await updateRecord(
      recordId.toString(),
      "grows",
      dataToUpdate
    );

    if (result.success) {
      console.log("Growth cycle updated successfully:", result.updatedRecord);
      revalidatePath("/dashboard/irrigationSchedule");
    } else {
      console.error("Update failed:", result.error);
    }
  };

  const handleVegFlowerMid = async () => {
    "use server";

    const dataToUpdate: PartialUpdateData = {
      growth_cycle: "veg_flower_mid",
    };

    const result = await updateRecord(
      recordId.toString(),
      "grows",
      dataToUpdate
    );

    if (result.success) {
      console.log("Growth cycle updated successfully:", result.updatedRecord);
      revalidatePath("/dashboard/irrigationSchedule");
    } else {
      console.error("Update failed:", result.error);
    }
  };

  const handleGenFlowerEnd = async () => {
    "use server";

    const dataToUpdate: PartialUpdateData = {
      growth_cycle: "gen_flower_end",
    };

    const result = await updateRecord(
      recordId.toString(),
      "grows",
      dataToUpdate
    );

    if (result.success) {
      console.log("Growth cycle updated successfully:", result.updatedRecord);
      revalidatePath("/dashboard/irrigationSchedule");
    } else {
      console.error("Update failed:", result.error);
    }
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <form action={handleVegGrowth}>
          <button
            type="submit"
            className={`flex items-center w-full text-left p-2 rounded transition-colors ${
              selectedGrowthCycle === "veg_growth"
                ? "bg-blue-100 border-2 border-blue-500"
                : "hover:bg-gray-50 border-2 border-transparent"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center ${
                selectedGrowthCycle === "veg_growth"
                  ? "border-blue-500 bg-blue-500"
                  : "border-gray-300"
              }`}
            >
              {selectedGrowthCycle === "veg_growth" && (
                <div className="w-2 h-2 rounded-full bg-white"></div>
              )}
            </div>
            Vegetative Growth
          </button>
        </form>

        <form action={handleGenFlowerStart}>
          <button
            type="submit"
            className={`flex items-center w-full text-left p-2 rounded transition-colors ${
              selectedGrowthCycle === "gen_flower_start"
                ? "bg-blue-100 border-2 border-blue-500"
                : "hover:bg-gray-50 border-2 border-transparent"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center ${
                selectedGrowthCycle === "gen_flower_start"
                  ? "border-blue-500 bg-blue-500"
                  : "border-gray-300"
              }`}
            >
              {selectedGrowthCycle === "gen_flower_start" && (
                <div className="w-2 h-2 rounded-full bg-white"></div>
              )}
            </div>
            Generative Flower Start
          </button>
        </form>

        <form action={handleVegFlowerMid}>
          <button
            type="submit"
            className={`flex items-center w-full text-left p-2 rounded transition-colors ${
              selectedGrowthCycle === "veg_flower_mid"
                ? "bg-blue-100 border-2 border-blue-500"
                : "hover:bg-gray-50 border-2 border-transparent"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center ${
                selectedGrowthCycle === "veg_flower_mid"
                  ? "border-blue-500 bg-blue-500"
                  : "border-gray-300"
              }`}
            >
              {selectedGrowthCycle === "veg_flower_mid" && (
                <div className="w-2 h-2 rounded-full bg-white"></div>
              )}
            </div>
            Vegetative Flower Middle
          </button>
        </form>

        <form action={handleGenFlowerEnd}>
          <button
            type="submit"
            className={`flex items-center w-full text-left p-2 rounded transition-colors ${
              selectedGrowthCycle === "gen_flower_end"
                ? "bg-blue-100 border-2 border-blue-500"
                : "hover:bg-gray-50 border-2 border-transparent"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center ${
                selectedGrowthCycle === "gen_flower_end"
                  ? "border-blue-500 bg-blue-500"
                  : "border-gray-300"
              }`}
            >
              {selectedGrowthCycle === "gen_flower_end" && (
                <div className="w-2 h-2 rounded-full bg-white"></div>
              )}
            </div>
            Generative Flower End
          </button>
        </form>
      </div>
    </div>
  );
}
