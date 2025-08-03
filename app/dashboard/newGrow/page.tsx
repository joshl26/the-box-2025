/* eslint-disable @typescript-eslint/no-explicit-any */
// app/dashboard/newGrow/page.tsx
import { fetchGrows, createGrow, deleteGrow, updateGrow } from "@/app/actions";

interface PartialUpdateData {
  [key: string]: any;
}

export default async function NewGrowPage() {
  const grows = await fetchGrows();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Grows</h1>

      {/* Create Form */}
      <div className="shadow-md rounded-lg p-6 mb-6 text-white">
        <h2 className="text-xl font-semibold mb-4">Add New Grow</h2>
        <form action={createGrow} className="space-y-4">
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
          {/* <DeleteGrowForm growId={grow.Id} /> */}
        </div>
      </div>
    </div>
  );
}

// Edit form component
function EditGrowForm({ grow }: { grow: any }) {
  return (
    <details className="relative">
      <summary className="cursor-pointer bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
        Edit
      </summary>

      <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10 w-80">
        <form action={updateGrow} className="space-y-3">
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

// Delete form component
function DeleteGrowForm({ growId }: { growId: number }) {
  return (
    <form action={deleteGrow} className="inline">
      <input type="hidden" name="Id" value={growId} />
      <button
        type="submit"
        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
        onClick={(e) => {
          if (!confirm("Are you sure you want to delete this grow?")) {
            e.preventDefault();
          }
        }}
      >
        Delete
      </button>
    </form>
  );
}
