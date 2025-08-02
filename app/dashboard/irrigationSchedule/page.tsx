// app/dashboard/irrigationSchedule/page.tsx
import { fetchGrows } from "@/app/actions";
import RadioButton from "@/app/components/GrowthCycleRadioButton";

export default async function IrrigationSchedule() {
  const grows = await fetchGrows();

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
                {grow.strain} - {grow.growNotes} - {grow.currentlySelected}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <h2>Irrigation Schedule</h2>
      <p>Manage your grows irrigation schedule here.</p>
      <div className="p-8 max-w-md mx-auto">
        <RadioButton />
      </div>
    </div>
  );
}
