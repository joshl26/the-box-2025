// import { usePathname } from "next/navigation";

import { fetchGrows } from "../actions";

export default async function DashboardPage() {
  // const pathname = usePathname();
  const grows = await fetchGrows();

  return (
    <div>
      <div className="mt-4 ">
        {/* The content for the active tab will be rendered by Next.js based on the URL */}
        {/* You can add a fallback or default content here if needed */}
        {/* {pathname === "/dashboard" && <p>Select a tab to view content.</p>} */}
        {/* <video width="full" height="auto" controls autoPlay loop preload="none">
          <source src="video\video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video> */}
        <div className=" mx-auto  shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Current Grows</h2>
          <p>Strain - Grow Note - Currently Selected</p>
          <ul className="max-h-35 overflow-y-scroll border border-gray-300 rounded-md p-2">
            {grows.fetchGrows?.map((grow) => (
              <li
                className="p-1 border-b border-gray-200 last:border-b-0"
                key={grow.Id}
              >
                <p>
                  {grow.strain} - {grow.grow_notes} - {grow.currently_selected}
                </p>
                {/* <form
                  // action={handleUpdate}
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
                </form> */}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
