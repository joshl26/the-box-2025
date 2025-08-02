// app/components/GrowthCycleRadioButton.tsx

import { fetchCurrentlySelectedGrow, updateRecord } from "../actions";

interface PartialUpdateData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Allows for any key-value pair for partial updates
}

export default async function GrowthCycleRadioButton() {
  const currentlySelected = await fetchCurrentlySelectedGrow();

  const selectedGrowthCycle =
    currentlySelected.fetchCurrentlySelectedGrow.growth_cycle;

  const recordId = currentlySelected.fetchCurrentlySelectedGrow.Id;

  const handleUpdate = async (formData: FormData) => {
    "use server"; // This Server Action is defined inline

    const Id = formData.get("recordId") as string;

    const growth_cycle = formData.get("myRadioGroup") as string;

    const dataToUpdate: PartialUpdateData = {};

    if (growth_cycle) dataToUpdate.growth_cycle = growth_cycle;

    const result = await updateRecord(Id, "grows", dataToUpdate);
    if (result.success) {
      console.log("Record updated successfully:", result.updatedRecord);
    } else {
      console.error("Update failed:", result.error);
    }
  };

  return (
    <form action={handleUpdate}>
      <input type="hidden" name="recordId" value={recordId} />
      <div>
        <input
          type="radio"
          id="option1"
          name="myRadioGroup"
          value="veg_growth"
          defaultChecked={selectedGrowthCycle === "veg_growth" ? true : false}
        />
        <label htmlFor="option1">Vegetative Growth</label>
      </div>
      <div>
        <input
          type="radio"
          id="option2"
          name="myRadioGroup"
          value="gen_flower_start"
          defaultChecked={
            selectedGrowthCycle === "gen_flower_start" ? true : false
          }
        />
        <label htmlFor="option2">Generative Flower Start</label>
      </div>
      <div>
        <input
          type="radio"
          id="option3"
          name="myRadioGroup"
          value="gen_flower_mid"
          defaultChecked={
            selectedGrowthCycle === "gen_flower_mid" ? true : false
          }
        />
        <label htmlFor="option3">Generative Flower Middle</label>
      </div>
      <div>
        <input
          type="radio"
          id="option4"
          name="myRadioGroup"
          value="gen_flower_end"
          defaultChecked={
            selectedGrowthCycle === "gen_flower_end" ? true : false
          }
        />
        <label htmlFor="option4">Generative Flower End</label>
      </div>
      <button type="submit">Save Selection</button>
    </form>
  );
}
