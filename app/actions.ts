// app/actions.ts
"use server";

import pool from "@/db/db";
import { revalidatePath } from "next/cache";

interface PartialUpdateData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Allows for any key-value pair for partial updates
}

export async function fetchGrows() {
  try {
    const result = await pool.query('SELECT * FROM grows ORDER BY "Id" ASC');
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
  Id: string,
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

    const query = `UPDATE ${tableName} SET ${setClause} WHERE "Id" = $1 RETURNING *;`;
    const result = await pool.query(query, [Id, ...values]);

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

export async function updateGrowthCycleColumn(Id?: string, value?: string) {
  try {
    const result = await pool.query(
      `UPDATE grows SET growth_cycle = ${value} WHERE Id = ${Id}`
    );

    // You can also revalidate paths or redirect here if needed
    revalidatePath("/your-page");

    return {
      success: true,
      message: `Growth cycle switched to "${value}", column updated successfully`,
      timestamp: new Date().toISOString(),
      updatedRecord: result.rows[0],
    };
  } catch (error) {
    console.error("Error updating column:", error);
  }
}
