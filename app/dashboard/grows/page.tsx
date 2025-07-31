// app/dashboard/grows/page.tsx
"use client";

import { useState, useEffect } from "react";

interface Grow {
  Id: number;
  strain: string;
  growNotes: string;
}

export default function HomePage() {
  const [grows, setGrows] = useState<Grow[]>([]);
  const [newGrowStrain, setNewGrowStrain] = useState("");
  const [newGrowGrowNotes, setNewGrowGrowNotes] = useState("");
  const [editingGrow, setEditingGrow] = useState<Grow | null>(null);

  useEffect(() => {
    fetchGrows();
  }, []);

  const fetchGrows = async () => {
    const res = await fetch("/api/grows");

    const data: Grow[] = await res.json();
    console.log(data);
    setGrows(data);
  };

  const handleCreate = async () => {
    await fetch("/api/grows", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        strain: newGrowStrain,
        growNotes: newGrowGrowNotes,
      }),
    });
    setNewGrowStrain("");
    setNewGrowGrowNotes("");
    fetchGrows();
  };

  const handleUpdate = async () => {
    if (!editingGrow) return;
    await fetch("/api/grows", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingGrow),
    });
    setEditingGrow(null);
    fetchGrows();
  };

  const handleDelete = async (Id: number) => {
    await fetch("/api/grows", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Id }),
    });
    fetchGrows();
  };

  return (
    <div>
      <h1>Grows</h1>

      {/* Create Form */}
      <div>
        <input
          type="text"
          placeholder="New Grow Strain"
          value={newGrowStrain}
          onChange={(e) => setNewGrowStrain(e.target.value)}
        />
        <input
          type="text"
          placeholder="New Grow GrowNotes"
          value={newGrowGrowNotes}
          onChange={(e) => setNewGrowGrowNotes(e.target.value)}
        />
        <button onClick={handleCreate}>Add Grow</button>
      </div>

      {/* Edit Form */}
      {editingGrow && (
        <div>
          <h2>Edit Grow</h2>
          <input
            type="text"
            value={editingGrow.strain}
            onChange={(e) =>
              setEditingGrow({ ...editingGrow, strain: e.target.value })
            }
          />
          <input
            type="text"
            value={editingGrow.growNotes}
            onChange={(e) =>
              setEditingGrow({ ...editingGrow, growNotes: e.target.value })
            }
          />
          <button onClick={handleUpdate}>Save Changes</button>
          <button onClick={() => setEditingGrow(null)}>Cancel</button>
        </div>
      )}

      {/* Grow List */}
      <ul>
        {grows.map((grow) => (
          <li key={grow.Id}>
            {grow.strain} - {grow.growNotes}
            <button onClick={() => setEditingGrow(grow)}>Edit</button>
            <button onClick={() => handleDelete(grow.Id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
