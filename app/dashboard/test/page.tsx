// app/page.tsx
import { updateRecord } from "@/app/actions";

interface PartialUpdateData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Allows for any key-value pair for partial updates
}

export default async function HomePage() {
  const handleUpdate = async (formData: FormData) => {
    "use server"; // This Server Action is defined inline

    const Id = formData.get("Id") as string;
    const strain = formData.get("strain") as string;
    const growNotes = formData.get("growNotes") as string;

    const dataToUpdate: PartialUpdateData = {};
    if (strain) dataToUpdate.strain = strain;
    if (growNotes) dataToUpdate.growNotes = growNotes;

    const result = await updateRecord(Id, "grows", dataToUpdate);
    if (result.success) {
      console.log("Record updated successfully:", result.updatedRecord);
    } else {
      console.error("Update failed:", result.error);
    }
  };

  return (
    <form action={handleUpdate}>
      <input type="text" name="Id" placeholder="Record ID" required />
      <input type="text" name="strain" placeholder="New Strain (optional)" />
      <input
        type="text"
        name="growNotes"
        placeholder="New GrowNotes (optional)"
      />
      <button type="submit">Update Record</button>
    </form>
  );
}
