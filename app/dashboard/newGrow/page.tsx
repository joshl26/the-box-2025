// app/dashboard/newGrow/page.tsx
import { createGrow } from "@/app/actions";
import { redirect } from "next/navigation";

export default async function NewGrowPage() {
  const handleCreate = async (formData: FormData) => {
    "use server";

    try {
      const result = await createGrow(formData);
      if (result && !result.success) {
        console.error("Create failed:", result.error);
        // Handle error case - you might want to show an error message here
        return;
      }
      // If we get here and no result, it means createGrow redirected successfully
      console.log("Grow created successfully and redirected!");
    } catch (error) {
      // Handle redirect errors separately from other errors
      if (error && typeof error === "object" && "digest" in error) {
        // This is likely a Next.js redirect from createGrow, re-throw it
        throw error;
      }
      console.error("Handle create error:", error);
    }
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical text-black"
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
    </div>
  );
}
