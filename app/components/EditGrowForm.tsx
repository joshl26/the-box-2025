// app/components/EditGrowForm.tsx
import { updateRecord } from "../actions";

interface Grow {
  Id: number;
  strain: string;
  grow_notes: string;
  currently_selected: string;
}

interface EditGrowFormProps {
  grow: Grow;
}

interface PartialUpdateData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export default function EditGrowForm({ grow }: EditGrowFormProps) {
  const handleUpdate = async (formData: FormData) => {
    "use server";

    const Id = formData.get("Id") as string;
    const strain = formData.get("strain") as string;
    const grow_notes = formData.get("grow_notes") as string;
    const currently_selected = formData.get("currently_selected") as string;

    const dataToUpdate: PartialUpdateData = {};

    if (strain) dataToUpdate.strain = strain;
    if (grow_notes) dataToUpdate.grow_notes = grow_notes;
    if (currently_selected)
      dataToUpdate.currently_selected = currently_selected;

    const result = await updateRecord(Id, "grows", dataToUpdate);

    if (result.success) {
      console.log("Record updated successfully:", result.updatedRecord);
    } else {
      console.error("Update failed:", result.error);
    }
  };

  return (
    <div className="max-w-md mx-auto  shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Edit Grow Details</h2>

      <form action={handleUpdate} className="space-y-4">
        <input type="hidden" name="Id" value={grow.Id} />

        {/* Strain Input */}
        <div>
          <label htmlFor="strain" className="block text-sm font-medium  mb-1">
            Strain
          </label>
          <input
            type="text"
            id="strain"
            name="strain"
            defaultValue={grow.strain}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter strain name"
          />
        </div>

        {/* Grow Notes Input */}
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
            defaultValue={grow.grow_notes}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            placeholder="Enter grow notes"
          />
        </div>

        {/* Currently Selected Input */}
        <div>
          <label
            htmlFor="currently_selected"
            className="block text-sm font-medium mb-1"
          >
            Currently Selected
          </label>
          <select
            id="currently_selected"
            name="currently_selected"
            defaultValue={grow.currently_selected}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        >
          Update Grow Details
        </button>
      </form>
    </div>
  );
}
