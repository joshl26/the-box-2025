// app/dashboard/irrigationSchedule/page.tsx
import { fetchCurrentlySelectedGrow, fetchGrows } from "@/app/actions";
import RadioButton from "@/app/components/GrowthCycleRadioButton";

export default async function IrrigationSchedule() {
  const grows = await fetchGrows();
  const currentlySelected = await fetchCurrentlySelectedGrow();

  return (
    <div>
      <div className="mx-auto shadow-md rounded-lg pb-4">
        <p>Strain - Grow Note - Currently Selected</p>
        <ul className="max-h-15 overflow-y-scroll border border-gray-300 rounded-md p-2 ">
          {grows.fetchGrows?.map((grow) => (
            <li
              className="p-1 border-b border-gray-200 last:border-b-0"
              key={grow.Id}
            >
              <p>
                {grow.strain} - {grow.grow_notes} - {grow.currently_selected}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <h2>Irrigation Schedule</h2>
      <p>Manage your grows irrigation schedule here.</p>
      <div className="p-8 max-w-md mx-auto">
        <RadioButton />
        <h2>Currently Selected Growth Cycle:</h2>
        <p>
          {currentlySelected.fetchCurrentlySelectedGrow.growth_cycle ===
          "veg_growth"
            ? "Vegetative Growth"
            : ""}
          {currentlySelected.fetchCurrentlySelectedGrow.growth_cycle ===
          "gen_flower_start"
            ? "Generative Flower Start"
            : ""}
          {currentlySelected.fetchCurrentlySelectedGrow.growth_cycle ===
          "gen_flower_mid"
            ? "Generative Flower Middle"
            : ""}
          {currentlySelected.fetchCurrentlySelectedGrow.growth_cycle ===
          "gen_flower_end"
            ? "Generative Flower End"
            : ""}
        </p>
      </div>
    </div>
  );
}
