// // app/api/grows/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import pool from "@/db/db"; // Adjust path if necessary

// // GET all grows
// export async function GET() {
//   try {
//     const { rows } = await pool.query('SELECT * FROM grows ORDER BY "Id" ASC');
//     return NextResponse.json(rows);
//   } catch (error) {
//     console.error("Error fetching grows:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch grows" },
//       { status: 500 }
//     );
//   }
// }

// // POST (Create) a new item
// export async function POST(req: NextRequest) {
//   try {
//     const { growNotes } = await req.json();
//     const { rows } = await pool.query(
//       "INSERT INTO grows (growNotes) VALUES ($1) RETURNING *",
//       [growNotes]
//     );
//     return NextResponse.json(rows[0], { status: 201 });
//   } catch (error) {
//     console.error("Error creating item:", error);
//     return NextResponse.json(
//       { error: "Failed to create item" },
//       { status: 500 }
//     );
//   }
// }

// app/api/grows/route.ts
import { NextResponse } from "next/server";
import pool from "@/db/db";

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM grows ORDER BY "Id" ASC');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching grows:", error);
    return NextResponse.json(
      { error: "Failed to fetch grows" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { strain, growNotes } = await req.json();
    const result = await pool.query(
      'INSERT INTO grows ("strain", "growNotes") VALUES ($1, $2) RETURNING *',
      [strain, growNotes]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error creating item:", error);
    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 }
    );
  }
}

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

export async function PUT(req: Request) {
  try {
    const { Id, strain, growNotes } = await req.json();
    const result = await pool.query(
      'UPDATE grows SET "strain" = $1, "growNotes" = $2 WHERE "Id" = $3 RETURNING *',
      [strain, growNotes, Id]
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Grow not found" }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating grow:", error);
    return NextResponse.json(
      { error: "Failed to update grow" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { Id } = await req.json(); // Assuming Id is sent in the body for DELETE
    const result = await pool.query(
      'DELETE FROM grows WHERE "Id" = $1 RETURNING *',
      [Id]
    );
    if (result.rows.length === 0) {
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
