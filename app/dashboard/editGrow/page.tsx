// app/dashboard/editGrow/page.tsx
import { fetchCurrentlySelectedGrow } from "@/app/actions";
import EditGrowForm from "@/app/components/EditGrowForm";

export default async function EditGrowPage() {
  const currentlySelected = await fetchCurrentlySelectedGrow();

  if (
    !currentlySelected.success ||
    !currentlySelected.fetchCurrentlySelectedGrow
  ) {
    return (
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-red-600">Error</h2>
        <p>No currently selected grow found or failed to fetch data.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Grow</h1>
      <EditGrowForm grow={currentlySelected.fetchCurrentlySelectedGrow} />
    </div>
  );
}
