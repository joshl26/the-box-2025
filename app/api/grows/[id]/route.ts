// app/api/items/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/db/db";

// GET a single grow by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { Id: string } }
) {
  try {
    const { Id } = params;
    const { rows } = await pool.query("SELECT * FROM grows WHERE Id = $1", [
      Id,
    ]);
    if (rows.length === 0) {
      return NextResponse.json({ error: "Grow not found" }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Error fetching grow by ID:", error);
    return NextResponse.json(
      { error: "Failed to fetch grow" },
      { status: 500 }
    );
  }
}

// // PUT (Update) an grow by ID
// export async function PUT(
//   req: NextRequest,
//   { params }: { params: { Id: string } }
// ) {
//   try {
//     const { Id } = params;
//     const { growNotes } = await req.json();
//     const { rows } = await pool.query(
//       "UPDATE grows SET growNotes = $1 WHERE Id = $2 RETURNING *",
//       [growNotes, Id]
//     );
//     if (rows.length === 0) {
//       return NextResponse.json({ error: "Grow not found" }, { status: 404 });
//     }
//     return NextResponse.json(rows[0]);
//   } catch (error) {
//     console.error("Error updating grow:", error);
//     return NextResponse.json(
//       { error: "Failed to update grow" },
//       { status: 500 }
//     );
//   }
// }

export async function PATCH(
  req: Request,
  { params }: { params: { Id: string } }
) {
  try {
    const { Id } = params;
    const updates = await req.json();
    const fields = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ");
    const values = Object.values(updates);

    if (fields.length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `UPDATE grows SET ${fields} WHERE Id = $${values.length + 1} RETURNING *`,
      [...values, Id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Grow not found" }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error partially updating grow:", error);
    return NextResponse.json(
      { error: "Failed to partially update grow" },
      { status: 500 }
    );
  }
}

// DELETE an grow by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { Id: string } }
) {
  try {
    const { Id } = params;
    const { rowCount } = await pool.query("DELETE FROM grows WHERE Id = $1", [
      Id,
    ]);
    if (rowCount === 0) {
      return NextResponse.json({ error: "Grow not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Grow deleted successfully" });
  } catch (error) {
    console.error("Error deleting grow:", error);
    return NextResponse.json(
      { error: "Failed to delete grow" },
      { status: 500 }
    );
  }
}
