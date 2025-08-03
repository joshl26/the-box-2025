/* eslint-disable @typescript-eslint/no-explicit-any */
// app/dashboard/newGrow/page.tsx
import {
  fetchGrows,
  createGrow,
  deleteGrow,
  updateGrow,
  updateRecord,
} from "@/app/actions";

interface PartialUpdateData {
  [key: string]: any;
}

export default async function NewGrowPage() {
  const grows = await fetchGrows();

  const handleCreate = async (formData: FormData) => {
    "use server"; // This Server Action is defined inline

    const Id = formData.get("Id") as string;
    const strain = formData.get("strain") as string;
    const growNotes = formData.get("growNotes") as string;

    // const dataToUpdate: PartialUpdateData = {};
    // if (strain) dataToUpdate.strain = strain;
    // if (growNotes) dataToUpdate.growNotes = growNotes;

    // const result = await createGrow(Id);
    // if (result.success) {
    //   console.log("Record updated successfully:", result.updatedRecord);
    // } else {
    //   console.error("Update failed:", result.error);
    // }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Grows</h1>

      {/* Create Form */}
      <div className="shadow-md rounded-lg p-6 mb-6 text-white">
        <h2 className="text-xl font-semibold mb-4">Add New Grow</h2>
        <form action={handleCreate} className="space-y-4">
          <div>
            <label htmlFor="strain" className="block text-sm font-medium  mb-1">
              Strain
            </label>
            <input
              type="text"
              id="strain"
              name="strain"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter strain name"
            />
          </div>

          <div>
            <label
              htmlFor="grow_notes"
              className="block text-sm font-medium  mb-1"
            >
              Grow Notes
            </label>
            <textarea
              id="grow_notes"
              name="grow_notes"
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              placeholder="Enter grow notes"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Add Grow
          </button>
        </form>
      </div>

      {/* Grow List */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Current Grows</h2>

        {grows.success && grows.fetchGrows && grows.fetchGrows.length > 0 ? (
          <div className="space-y-4">
            {grows.fetchGrows.map((grow) => (
              <GrowItem key={grow.Id} grow={grow} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            No grows found. Add your first grow above!
          </p>
        )}
      </div>
    </div>
  );
}

// Separate component for each grow item to handle edit state
function GrowItem({ grow }: { grow: any }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="font-medium text-lg">{grow.strain}</h3>
          <p className="text-gray-600 text-sm mt-1">{grow.grow_notes}</p>
          <p className="text-xs text-gray-400 mt-1">
            Currently Selected: {grow.currently_selected || "false"}
          </p>
        </div>

        <div className="flex space-x-2 ml-4">
          <EditGrowForm grow={grow} />
          <DeleteGrowForm growId={grow.Id} />
        </div>
      </div>
    </div>
  );
}

// Edit form component
function EditGrowForm({ grow }: { grow: any }) {
  const handleUpdate = async (formData: FormData) => {
    "use server"; // This Server Action is defined inline

    const Id = formData.get("Id") as string;
    const strain = formData.get("strain") as string;
    const grow_notes = formData.get("grow_notes") as string;

    const dataToUpdate: PartialUpdateData = {};
    if (strain) dataToUpdate.strain = strain;
    if (grow_notes) dataToUpdate.grow_notes = grow_notes;

    const result = await updateRecord(Id, "grows", dataToUpdate);
    if (result.success) {
      console.log("Record updated successfully:", result.updatedRecord);
    } else {
      console.error("Update failed:", result.error);
    }
  };
  return (
    <details className="relative">
      <summary className="cursor-pointer bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
        Edit
      </summary>

      <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10 w-80">
        <form action={handleUpdate} className="space-y-3">
          <input type="hidden" name="Id" value={grow.Id} />

          <div>
            <label
              htmlFor={`strain-${grow.Id}`}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Strain
            </label>
            <input
              type="text"
              id={`strain-${grow.Id}`}
              name="strain"
              defaultValue={grow.strain}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label
              htmlFor={`grow_notes-${grow.Id}`}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Grow Notes
            </label>
            <textarea
              id={`grow_notes-${grow.Id}`}
              name="grow_notes"
              defaultValue={grow.grow_notes}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-vertical"
            />
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-1 px-3 rounded text-sm hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </details>
  );
}

// Pure server-side delete component (no client JavaScript needed)
function DeleteGrowForm({ growId }: { growId: number }) {
  const handleDelete = async (formData: FormData) => {
    "use server"; // This Server Action is defined inline

    // const Id = formData.get("Id") as string;
    // const strain = formData.get("strain") as string;
    // const grow_notes = formData.get("grow_notes") as string;

    // const dataToUpdate: PartialUpdateData = {};
    // if (strain) dataToUpdate.strain = strain;
    // if (grow_notes) dataToUpdate.grow_notes = grow_notes;

    // const result = await updateRecord(Id, "grows", dataToUpdate);
    // if (result.success) {
    //   console.log("Record updated successfully:", result.updatedRecord);
    // } else {
    //   console.error("Update failed:", result.error);
    // }
  };

  return (
    <details className="relative inline">
      <summary className="cursor-pointer bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 select-none">
        Delete
      </summary>

      <div className="absolute right-0 top-8 bg-white border border-red-200 rounded-lg shadow-lg p-4 z-10 w-64">
        <p className="text-sm text-gray-700 mb-3 font-medium">
          ⚠️ Delete this grow?
        </p>
        <p className="text-xs text-gray-600 mb-4">
          This action cannot be undone.
        </p>

        <div className="flex space-x-2">
          <form action={handleDelete} className="inline">
            <input type="hidden" name="Id" value={growId} />
            <button
              type="submit"
              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 font-medium"
            >
              Yes, Delete
            </button>
          </form>

          {/* This button closes the details by removing focus */}
          <button
            type="button"
            className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400"
            // onBlur={() => {
            //   // Pure CSS solution - clicking outside will close the details
            // }}
          >
            Cancel
          </button>
        </div>
      </div>
    </details>
  );
}
