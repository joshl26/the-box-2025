// app/dashboard/irrigationSchedule/page.tsx
import { fetchCurrentlySelectedGrow } from "@/app/actions";
import RadioButton from "@/app/components/GrowthCycleRadioButton";
import NumberInput from "@/app/components/NumberInput";
import TimeInput from "@/app/components/TimeInput";
import Image from "next/image";

export default async function IrrigationSchedule() {
  const currentlySelected = await fetchCurrentlySelectedGrow();
  const growData = currentlySelected.fetchCurrentlySelectedGrow;
  const growthCycle = growData.growth_cycle;

  // Function to get the current value based on field and growth cycle
  const getCurrentValue = (
    fieldPrefix: string,
    fieldType: string
  ): number | string => {
    let columnName = "";

    if (fieldType === "num_shots") {
      if (growthCycle === "veg_growth")
        columnName = `${fieldPrefix}_num_shots_growth`;
      else if (growthCycle === "gen_flower_start")
        columnName = `${fieldPrefix}_num_shots_flower_start`;
      else if (growthCycle === "veg_flower_mid")
        columnName = `${fieldPrefix}_num_shots_flower_middle`;
      else if (growthCycle === "gen_flower_end")
        columnName = `${fieldPrefix}_num_shots_flower_end`;
    } else if (fieldType === "start_time") {
      if (growthCycle === "veg_growth")
        columnName = `${fieldPrefix}_start_time_growth`;
      else if (growthCycle === "gen_flower_start")
        columnName = `${fieldPrefix}_start_time_flower_start`;
      else if (growthCycle === "veg_flower_mid")
        columnName = `${fieldPrefix}_start_time_flower_middle`;
      else if (growthCycle === "gen_flower_end")
        columnName = `${fieldPrefix}_start_time_flower_end`;
    } else if (fieldType === "shot_size") {
      if (growthCycle === "veg_growth")
        columnName = `${fieldPrefix}_shot_size_growth`;
      else if (growthCycle === "gen_flower_start")
        columnName = `${fieldPrefix}_shot_size_flower_start`;
      else if (growthCycle === "veg_flower_mid")
        columnName = `${fieldPrefix}_shot_size_flower_middle`;
      else if (growthCycle === "gen_flower_end")
        columnName = `${fieldPrefix}_shot_size_flower_end`;
    }

    // Return appropriate default based on field type
    if (fieldType === "start_time") {
      return growData[columnName] || "00:00:00";
    }
    return growData[columnName] || 0;
  };

  return (
    <div>
      <h2>Irrigation Schedule</h2>
      <p>Manage your grows irrigation schedule here.</p>
      <div className="flex flex-row">
        <div className="p-8 max-w-md flex-col">
          <RadioButton />
          <h2>Currently Selected Growth Cycle:</h2>
          <p>
            {growthCycle === "veg_growth" ? "Vegetative Growth" : ""}
            {growthCycle === "gen_flower_start"
              ? "Generative Flower Start"
              : ""}
            {growthCycle === "veg_flower_mid" ? "Vegetative Flower Middle" : ""}
            {growthCycle === "gen_flower_end" ? "Generative Flower End" : ""}
          </p>
        </div>
        <div className="flex-col">
          {growthCycle === "veg_growth" && (
            <Image
              src="/images/vegetative_growth.png"
              alt=""
              width={500}
              height={100}
            />
          )}
          {growthCycle === "gen_flower_start" && (
            <Image
              src="/images/generative_flower_start.png"
              alt=""
              width={500}
              height={100}
            />
          )}
          {growthCycle === "veg_flower_mid" && (
            <Image
              src="/images/vegetative_flower_mid.png"
              alt=""
              width={500}
              height={100}
            />
          )}
          {growthCycle === "gen_flower_end" && (
            <Image
              src="/images/generative_flower_end.png"
              alt=""
              width={500}
              height={100}
            />
          )}
        </div>
        <div>
          <h2>P1</h2>
          <h3>Number of Shots</h3>
          <NumberInput
            id="p1_num_shots"
            initialValue={getCurrentValue("p1", "num_shots") as number}
            min={0}
            max={1000}
            step={1}
          />
          <h3>Start Time</h3>
          <TimeInput
            id="p1_start_time"
            initialValue={getCurrentValue("p1", "start_time") as string}
          />
          <h3>Size of Shots</h3>
          <NumberInput
            id="p1_shot_size"
            initialValue={getCurrentValue("p1", "shot_size") as number}
            min={0}
            max={1000}
            step={1}
          />
        </div>
        <div>
          <h2>P2</h2>
          <h3>Number of Shots</h3>
          <NumberInput
            id="p2_num_shots"
            initialValue={getCurrentValue("p2", "num_shots") as number}
            min={0}
            max={1000}
            step={1}
          />
          <h3>Start Time</h3>
          <TimeInput
            id="p2_start_time"
            initialValue={getCurrentValue("p2", "start_time") as string}
          />
          <h3>Size of Shots</h3>
          <NumberInput
            id="p2_shot_size"
            initialValue={getCurrentValue("p2", "shot_size") as number}
            min={0}
            max={1000}
            step={1}
          />
        </div>
        <div>
          <h2>P3</h2>
          <h3>Number of Shots</h3>
          <NumberInput
            id="p3_num_shots"
            initialValue={getCurrentValue("p3", "num_shots") as number}
            min={0}
            max={1000}
            step={1}
          />
          <h3>Start Time</h3>
          <TimeInput
            id="p3_start_time"
            initialValue={getCurrentValue("p3", "start_time") as string}
          />
          <h3>Size of Shots</h3>
          <NumberInput
            id="p3_shot_size"
            initialValue={getCurrentValue("p3", "shot_size") as number}
            min={0}
            max={1000}
            step={1}
          />
        </div>
      </div>
    </div>
  );
}
