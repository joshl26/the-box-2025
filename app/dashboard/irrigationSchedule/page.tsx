// app/dashboard/irrigationSchedule/page.tsx
import { fetchCurrentlySelectedGrow, fetchGrows } from "@/app/actions";
import RadioButton from "@/app/components/GrowthCycleRadioButton";
import NumberInput from "@/app/components/NumberInput";
import Image from "next/image";

export default async function IrrigationSchedule() {
  const currentlySelected = await fetchCurrentlySelectedGrow();

  return (
    <div>
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
