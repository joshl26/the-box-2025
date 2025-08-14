/* eslint-disable @typescript-eslint/no-explicit-any */
// app/actions.ts
"use server";

import pool from "@/db/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface PartialUpdateData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Allows for any key-value pair for partial updates
}

export async function fetchGrows() {
  try {
    const result = await pool.query('SELECT * FROM grows ORDER BY "id" ASC');
    return { success: true, fetchGrows: result.rows };
  } catch (error) {
    console.error("Error fetching grows:", error);
    return { success: false, error: "Failed to update record." };
  }
}

export async function fetchCurrentlySelectedGrow() {
  try {
    const result = await pool.query(
      "SELECT * FROM grows WHERE currently_selected = 'true'"
    );
    return { success: true, fetchCurrentlySelectedGrow: result.rows[0] };
  } catch (error) {
    console.error("Error fetching grows:", error);
    return { success: false, error: "Failed to update record." };
  }
}

export async function updateRecord(
  id: string,
  tableName: string,
  dataToUpdate: PartialUpdateData
) {
  try {
    const columns = Object.keys(dataToUpdate);
    const values = Object.values(dataToUpdate);

    // Construct the SET clause dynamically
    const setClause = columns
      .map((col, index) => `"${col}" = $${index + 2}`) // $1 for Id, then $2, $3...
      .join(", ");

    // console.log("id", id);

    const query = `UPDATE ${tableName} SET ${setClause} WHERE "id" = $1 RETURNING *;`;
    const result = await pool.query(query, [id, ...values]);

    revalidatePath(`/${tableName}`); // Revalidate the relevant path after update
    return { success: true, updatedRecord: result.rows[0] };
  } catch (error) {
    console.error("Error updating record:", error);
    return { success: false, error: "Failed to update record." };
  }
}

export async function handleMenuAction(action: string, value?: string) {
  console.log(
    `Server action executed: ${action}`,
    value ? `with value: ${value}` : ""
  );

  // Return response for client-side handling
  return {
    success: true,
    message: `Action "${action}" completed successfully`,
    timestamp: new Date().toISOString(),
  };

  // return { success: true, message: `Action ${action} completed` };
}

// Updated updateValueAction function to handle both numbers and time strings
export async function updateValueAction(
  fieldName: string,
  value: number | string
) {
  try {
    // Get the currently selected grow
    const currentGrowResult = await fetchCurrentlySelectedGrow();

    if (
      !currentGrowResult.success ||
      !currentGrowResult.fetchCurrentlySelectedGrow
    ) {
      throw new Error("No currently selected grow found");
    }

    const growData = currentGrowResult.fetchCurrentlySelectedGrow;
    const growId = growData.id;
    const growthCycle = growData.growth_cycle;

    // Map field names to database columns based on current growth cycle
    let dbColumnName = "";

    // Create a mapping object for cleaner logic
    const fieldMappings: { [key: string]: { [cycle: string]: string } } = {
      p1_num_shots: {
        veg_growth: "p1_num_shots_growth",
        gen_flower_start: "p1_num_shots_flower_start",
        veg_flower_mid: "p1_num_shots_flower_middle",
        gen_flower_end: "p1_num_shots_flower_end",
      },
      p1_start_time: {
        veg_growth: "p1_start_time_growth",
        gen_flower_start: "p1_start_time_flower_start",
        veg_flower_mid: "p1_start_time_flower_middle",
        gen_flower_end: "p1_start_time_flower_end",
      },
      p1_shot_size: {
        veg_growth: "p1_shot_size_growth",
        gen_flower_start: "p1_shot_size_flower_start",
        veg_flower_mid: "p1_shot_size_flower_middle",
        gen_flower_end: "p1_shot_size_flower_end",
      },
      p2_num_shots: {
        veg_growth: "p2_num_shots_growth",
        gen_flower_start: "p2_num_shots_flower_start",
        veg_flower_mid: "p2_num_shots_flower_middle",
        gen_flower_end: "p2_num_shots_flower_end",
      },
      p2_start_time: {
        veg_growth: "p2_start_time_growth",
        gen_flower_start: "p2_start_time_flower_start",
        veg_flower_mid: "p2_start_time_flower_middle",
        gen_flower_end: "p2_start_time_flower_end",
      },
      p2_shot_size: {
        veg_growth: "p2_shot_size_growth",
        gen_flower_start: "p2_shot_size_flower_start",
        veg_flower_mid: "p2_shot_size_flower_middle",
        gen_flower_end: "p2_shot_size_flower_end",
      },
      p3_num_shots: {
        veg_growth: "p3_num_shots_growth",
        gen_flower_start: "p3_num_shots_flower_start",
        veg_flower_mid: "p3_num_shots_flower_middle",
        gen_flower_end: "p3_num_shots_flower_end",
      },
      p3_start_time: {
        veg_growth: "p3_start_time_growth",
        gen_flower_start: "p3_start_time_flower_start",
        veg_flower_mid: "p3_start_time_flower_middle",
        gen_flower_end: "p3_start_time_flower_end",
      },
      p3_shot_size: {
        veg_growth: "p3_shot_size_growth",
        gen_flower_start: "p3_shot_size_flower_start",
        veg_flower_mid: "p3_shot_size_flower_middle",
        gen_flower_end: "p3_shot_size_flower_end",
      },
    };

    // Get the database column name
    if (fieldMappings[fieldName] && fieldMappings[fieldName][growthCycle]) {
      dbColumnName = fieldMappings[fieldName][growthCycle];
    }

    if (!dbColumnName) {
      throw new Error(
        `Unknown field name: ${fieldName} for growth cycle: ${growthCycle}`
      );
    }

    // Use existing updateRecord function
    const dataToUpdate: PartialUpdateData = {
      [dbColumnName]: value,
    };

    const result = await updateRecord(growId.toString(), "grows", dataToUpdate);

    if (result.success) {
      console.log(`Updated ${dbColumnName} to ${value} for grow ${growId}`);
      // Additional revalidation for irrigation schedule
      revalidatePath("/dashboard/irrigationSchedule");
      return result;
    } else {
      throw new Error(result.error || "Failed to update irrigation value");
    }
  } catch (error) {
    console.error("Error updating irrigation value:", error);
    throw new Error("Failed to update irrigation value");
  }
}
export async function createGrow(formData: FormData) {
  try {
    const strain = formData.get("strain") as string;
    const grow_notes = formData.get("grow_notes") as string;

    if (!strain || !grow_notes) {
      return { success: false, error: "Strain and grow notes are required." };
    }

    const result = await pool.query(
      'INSERT INTO grows ("strain", "grow_notes") VALUES ($1, $2) RETURNING *',
      [strain, grow_notes]
    );

    console.log("New grow created:", result.rows[0]);

    // Revalidate all relevant paths
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/newGrow");
    revalidatePath("/dashboard/editGrow");
    revalidatePath("/dashboard/irrigationSchedule");
    revalidatePath("/dashboard/lightingSchedule");

    // Redirect to dashboard
    redirect("/dashboard");
  } catch (error) {
    // Handle redirect errors separately from other errors
    if (error && typeof error === "object" && "digest" in error) {
      // This is likely a Next.js redirect, re-throw it
      throw error;
    }

    console.error("Error creating grow:", error);
    return { success: false, error: "Failed to create grow." };
  }
}
export async function deleteGrow(formData: FormData) {
  try {
    const Id = formData.get("Id") as string;

    if (!Id) {
      return { success: false, error: "Grow ID is required." };
    }

    const result = await pool.query(
      'DELETE FROM grows WHERE "id" = $1 RETURNING *',
      [Id]
    );

    if (result.rows.length === 0) {
      return { success: false, error: "Grow not found." };
    }

    // Revalidate all relevant paths after deletion
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/newGrow");
    revalidatePath("/dashboard/editGrow");
    revalidatePath("/dashboard/irrigationSchedule");
    revalidatePath("/dashboard/lightingSchedule");

    return { success: true, message: "Grow deleted successfully" };
  } catch (error) {
    console.error("Error deleting grow:", error);
    return { success: false, error: "Failed to delete grow." };
  }
}

export async function updateGrow(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const strain = formData.get("strain") as string;
    const grow_notes = formData.get("grow_notes") as string;

    // Handle checkbox - convert to boolean
    const grow_finished = formData.get("grow_finished") === ("true" as string);

    // console.log(grow_finished);

    if (!id) {
      return { success: false, error: "Grow ID is required." };
    }

    const dataToUpdate: PartialUpdateData = {};
    if (strain) dataToUpdate.strain = strain;
    if (grow_notes) dataToUpdate.grow_notes = grow_notes;

    // Always include grow_finished since we want to handle both true and false
    dataToUpdate.grow_finished = grow_finished;

    const result = await updateRecord(id, "grows", dataToUpdate);

    if (result.success) {
      redirect("/dashboard");
    } else {
      return result;
    }
  } catch (error) {
    console.error("Error updating grow:", error);
    return { success: false, error: "Failed to update grow." };
  }
}

export async function setActiveGrow(formData: FormData) {
  "use server";

  try {
    const newActiveId = formData.get("growId") as string;

    if (!newActiveId) {
      return { success: false, error: "Grow ID is required." };
    }

    // First, set all grows to currently_selected = 'false'
    await pool.query("UPDATE grows SET currently_selected = $1", ["false"]);

    // Then set the selected grow to currently_selected = 'true'
    const result = await pool.query(
      'UPDATE grows SET currently_selected = $1 WHERE "id" = $2 RETURNING *',
      ["true", newActiveId]
    );

    if (result.rows.length === 0) {
      return { success: false, error: "Grow not found." };
    }

    // Revalidate paths that depend on the currently selected grow
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/irrigationSchedule");
    revalidatePath("/dashboard/editGrow");
    revalidatePath("/dashboard/lightingSchedule");

    return {
      success: true,
      message: "Active grow updated successfully",
      activeGrow: result.rows[0],
    };
  } catch (error) {
    console.error("Error setting active grow:", error);
    return { success: false, error: "Failed to set active grow." };
  }
}

export async function fetchSensorData(
  sensorId?: number,
  hoursBack: number = 24
) {
  try {
    let query = `
    SELECT 
      time,
      sensor_id,
      value,
      metadata
    FROM sensor_data 
    WHERE time >= NOW() - $1::TEXT::INTERVAL
  `;

    const params: any[] = [hoursBack + " hours"];

    if (sensorId) {
      query += ` AND sensor_id = $2`;
      params.push(sensorId);
    }

    query += ` ORDER BY time ASC`;

    console.log(query, params);

    const result = await pool.query(query, params);

    console.log(result.rows);

    return {
      success: true,
      sensorData: result.rows.map((row) => ({
        ...row,
        time: row.time.toISOString(),
        metadata:
          typeof row.metadata === "string"
            ? JSON.parse(row.metadata)
            : row.metadata,
      })),
    };
  } catch (error) {
    console.error("Error fetching sensor data:", error);
    return { success: false, error: "Failed to fetch sensor data." };
  }
}
export async function fetchLatestSensorReading(sensorId: number) {
  try {
    const result = await pool.query(
      `SELECT 
        time,
        sensor_id,
        value,
        metadata
      FROM sensor_data 
      WHERE sensor_id = $1 
      ORDER BY time DESC 
      LIMIT 1`,
      [sensorId]
    );

    if (result.rows.length === 0) {
      return { success: false, error: "No sensor data found." };
    }

    const row = result.rows[0];
    return {
      success: true,
      latestReading: {
        ...row,
        time: row.time.toISOString(),
        metadata:
          typeof row.metadata === "string"
            ? JSON.parse(row.metadata)
            : row.metadata,
      },
    };
  } catch (error) {
    console.error("Error fetching latest sensor reading:", error);
    return { success: false, error: "Failed to fetch latest sensor reading." };
  }
}

export async function fetchSensorStats(
  sensorId: number,
  hoursBack: number = 24
) {
  try {
    const result = await pool.query(
      `SELECT 
        AVG(value) as avg_value,
        MIN(value) as min_value,
        MAX(value) as max_value,
        COUNT(*) as reading_count
      FROM sensor_data 
      WHERE sensor_id = $1 
        AND time >= NOW() - INTERVAL '${hoursBack} hours'`,
      [sensorId]
    );

    return {
      success: true,
      stats: {
        average: parseFloat(result.rows[0].avg_value || 0).toFixed(1),
        minimum: result.rows[0].min_value || 0,
        maximum: result.rows[0].max_value || 0,
        readingCount: parseInt(result.rows[0].reading_count || 0),
      },
    };
  } catch (error) {
    console.error("Error fetching sensor stats:", error);
    return { success: false, error: "Failed to fetch sensor stats." };
  }
}
