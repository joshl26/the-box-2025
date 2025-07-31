// app/page.tsx
import { updateRecord, fetchGrows } from "@/app/actions";

interface PartialUpdateData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Allows for any key-value pair for partial updates
}

export default async function HomePage() {
  const grows = await fetchGrows();
  //   console.log(grows);

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
    <ul>
      {grows.fetchGrows?.map((grow) => (
        <li key={grow.Id}>
          {grow.strain} - {grow.growNotes}
          <form
            action={handleUpdate}
            style={{ display: "inline-block", marginLeft: "10px" }}
          >
            <input type="hidden" name="Id" value={grow.Id} />
            <input
              type="text"
              name="strain"
              placeholder="New Strain"
              defaultValue={grow.strain}
            />
            <input
              type="text"
              name="growNotes"
              placeholder="New GrowNotes"
              defaultValue={grow.growNotes}
            />
            <button type="submit">Update</button>
          </form>
        </li>
      ))}
    </ul>
  );
}
