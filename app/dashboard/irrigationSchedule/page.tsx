// app/dashboard/irrigationSchedule/page.tsx
import { fetchCurrentlySelectedGrow, fetchGrows } from "@/app/actions";
import RadioButton from "@/app/components/GrowthCycleRadioButton";
import NumberInput from "@/app/components/NumberInput";
import Image from "next/image";

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
              key={grow.id}
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
      <div className="flex flex-row">
        <div className="p-8 max-w-md flex-col">
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
        <div className="flex-col">
          {currentlySelected.fetchCurrentlySelectedGrow.growth_cycle ===
          "veg_growth" ? (
            <Image
              src="/vegetative_growth.png"
              alt=""
              width={500}
              height={100}
            />
          ) : (
            ""
          )}
          {currentlySelected.fetchCurrentlySelectedGrow.growth_cycle ===
          "gen_flower_start" ? (
            <Image
              src="/generative_flower_start.png"
              alt=""
              width={500}
              height={100}
            />
          ) : (
            ""
          )}
          {currentlySelected.fetchCurrentlySelectedGrow.growth_cycle ===
          "veg_flower_mid" ? (
            <Image
              src="/vegetative_flower_mid.png"
              alt=""
              width={500}
              height={100}
            />
          ) : (
            ""
          )}
          {currentlySelected.fetchCurrentlySelectedGrow.growth_cycle ===
          "gen_flower_end" ? (
            <Image
              src="/generative_flower_end.png"
              alt=""
              width={500}
              height={100}
            />
          ) : (
            ""
          )}
        </div>
        <div>
          <h2>P1</h2>
          <h3>Number of Shots</h3>
          <NumberInput id="p1" initialValue={0} min={0} max={1000} step={1} />
          <h3>Time Between Shots</h3>
          <NumberInput id="p1" initialValue={0} min={0} max={1000} step={1} />
          <h3>Size of Shots</h3>
          <NumberInput id="p1" initialValue={0} min={0} max={1000} step={1} />
        </div>
        <div>
          <h2>P2</h2>
          <h3>Number of Shots</h3>
          <NumberInput id="p1" initialValue={0} min={0} max={1000} step={1} />
          <h3>Time Between Shots</h3>
          <NumberInput id="p1" initialValue={0} min={0} max={1000} step={1} />
          <h3>Size of Shots</h3>
          <NumberInput id="p1" initialValue={0} min={0} max={1000} step={1} />
        </div>
        <div>
          <h2>P3</h2>
          <h3>Number of Shots</h3>
          <NumberInput id="p1" initialValue={0} min={0} max={1000} step={1} />
          <h3>Time Between Shots</h3>
          <NumberInput id="p1" initialValue={0} min={0} max={1000} step={1} />
          <h3>Size of Shots</h3>
          <NumberInput id="p1" initialValue={0} min={0} max={1000} step={1} />
        </div>
      </div>
    </div>
  );
}
