// app/dashboard/irrigationSchedule/page.tsx
import { updateRecord, fetchGrows } from "@/app/actions";
import DropdownMenu from "@/app/components/DropdownMenu";

interface DropdownOption {
  id: string;
  label: string;
  value: string;
  action?: string;
}

export default async function IrrigationSchedule() {
  const grows = await fetchGrows();

  const menuOptions: DropdownOption[] = [
    {
      id: "1",
      label: "Vegetative Growth",
      value: "vegetativeGrowth",
      action: "growth",
    },
    {
      id: "2",
      label: "Generative Flower Start",
      value: "generativeFlowerStart",
      action: "flowerStart",
    },
    {
      id: "3",
      label: "Vegetative Flower Middle",
      value: "vegetativeFlowerMiddle",
      action: "flowerMiddle",
    },
    {
      id: "4",
      label: "Generative Flower End",
      value: "generativeFlowerEnd",
      action: "flowerEnd",
    },
    // {
    //   id: "5",
    //   label: "Flower Finish Flush",
    //   value: "flowerFlush",
    //   action: "flowerFlush",
    // },
  ];

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
        <h2 className="text-xl font-semibold mb-4">Dropdown Menu Example</h2>
        <DropdownMenu
          options={menuOptions}
          placeholder="Choose an action"
          className="w-full"
        />
      </div>
    </div>
  );
}
