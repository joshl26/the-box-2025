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

export async function updateValueAction(id: string, value: number) {
  console.log(id, value);

  // try {
  //   const client = await pool.connect();
  //   try {
  //     // Update the value in the database
  //     // Adjust the table name and column names as needed
  //     const query = `
  //       UPDATE number_inputs
  //       SET value = $1, updated_at = NOW()
  //       WHERE id = $2
  //     `;
  //     const result = await client.query(query, [value, id]);
  //     if (result.rowCount === 0) {
  //       // If no rows were updated, create a new record
  //       const insertQuery = `
  //         INSERT INTO number_inputs (id, value, created_at, updated_at)
  //         VALUES ($1, $2, NOW(), NOW())
  //         ON CONFLICT (id) DO UPDATE SET
  //           value = EXCLUDED.value,
  //           updated_at = EXCLUDED.updated_at
  //       `;
  //       await client.query(insertQuery, [id, value]);
  //     }
  //     // Revalidate the current path to refresh any cached data
  //
  //     return { success: true };
  //   } finally {
  //     client.release();
  //   }
  // } catch (error) {
  //   console.error("Database error:", error);
  //   throw new Error("Failed to update value in database");
  // }
  revalidatePath("/dashboard/irrigationSchdule");
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

    revalidatePath("/dashboard/newGrow");
    return { success: true, grow: result.rows[0] };
  } catch (error) {
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
      'DELETE FROM grows WHERE "Id" = $1 RETURNING *',
      [Id]
    );

    if (result.rows.length === 0) {
      return { success: false, error: "Grow not found." };
    }

    revalidatePath("/dashboard/newGrow");
    return { success: true, message: "Grow deleted successfully" };
  } catch (error) {
    console.error("Error deleting grow:", error);
    return { success: false, error: "Failed to delete grow." };
  }
}

export async function updateGrow(formData: FormData) {
  try {
    const Id = formData.get("Id") as string;
    const strain = formData.get("strain") as string;
    const grow_notes = formData.get("grow_notes") as string;

    if (!Id) {
      return { success: false, error: "Grow ID is required." };
    }

    const dataToUpdate: PartialUpdateData = {};
    if (strain) dataToUpdate.strain = strain;
    if (grow_notes) dataToUpdate.grow_notes = grow_notes;

    const result = await updateRecord(Id, "grows", dataToUpdate);

    if (result.success) {
      revalidatePath("/dashboard/newGrow");
      return { success: true, grow: result.updatedRecord };
    } else {
      return result;
    }
  } catch (error) {
    console.error("Error updating grow:", error);
    return { success: false, error: "Failed to update grow." };
  }
}
