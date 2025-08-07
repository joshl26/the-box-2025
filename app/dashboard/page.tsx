/* eslint-disable @typescript-eslint/no-explicit-any */
// app/dashboard/page.tsx
import { fetchGrows, setActiveGrow } from "../actions";
import DeleteButton from "../components/DeleteButton";

export default async function DashboardPage() {
  const grows = await fetchGrows();

  return (
    <div>
      <div className="mt-4">
        <div className="mx-auto shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Current Grows</h2>
          <p className="text-sm  mb-3">
            Click on a grow to make it active • Active grows are highlighted in
            blue
          </p>

          {grows.success && grows.fetchGrows && grows.fetchGrows.length > 0 ? (
            <div className="min-h-100 overflow-y-scroll border border-gray-300 rounded-md ">
              {grows.fetchGrows.map((grow) => (
                <SelectableGrowItem key={grow.id} grow={grow} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-white">
              <p>No grows found.</p>
              <p className="text-sm mt-2">
                <a
                  href="/dashboard/newGrow"
                  className="text-blue-500 hover:text-blue-700 underline"
                >
                  Add your first grow here
                </a>
              </p>
            </div>
          )}
        </div>

        {/* Active Grow Summary */}
        {grows.success && grows.fetchGrows && (
          <ActiveGrowSummary grows={grows.fetchGrows} />
        )}
      </div>
    </div>
  );
}

// Selectable grow item component using server actions
function SelectableGrowItem({ grow }: { grow: any }) {
  // boolean check for displaying which grow is selected
  const isActive = grow.currently_selected === "true";

  const handleSetActive = async (formData: FormData) => {
    "use server";

    const result = await setActiveGrow(formData);

    if (result.success) {
      console.log("Record updated successfully!");
    } else {
      console.error("Update failed:", result.error);
    }
  };

  return (
    <div className="w-full flex">
      {/* Main grow selection button */}
      <form action={handleSetActive} className="flex-1">
        <input type="hidden" name="growId" value={grow.id} />
        <button
          type="submit"
          className={`w-full text-left p-3 border-b border-gray-200 last:border-b-0 transition-all duration-200  hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset ${
            isActive
              ? "bg-blue-50 border-l-4 border-l-blue-500 shadow-sm"
              : "hover:border-l-4 hover:border-l-gray-300"
          }`}
        >
          <div className="flex items-center justify-between ">
            <div className="flex items-center space-x-3 ">
              {/* Status indicator dot */}
              <div
                className={`w-3 h-3 rounded-full flex-shrink-0 ${
                  isActive ? "bg-blue-500" : "bg-gray-300"
                }`}
              ></div>

              <div className="min-w-0 flex-1 ">
                <h3
                  className={`font-medium truncate ${
                    isActive ? "text-blue-900" : "text-white"
                  }`}
                >
                  {grow.strain}
                </h3>
                <p
                  className={`text-sm mt-1 truncate  ${
                    isActive ? "text-blue-700" : "text-white"
                  }`}
                >
                  {grow.grow_notes}
                </p>
                {grow.growth_cycle && (
                  <p
                    className={`text-xs mt-1 capitalize ${
                      isActive ? "text-blue-600" : "text-white"
                    }`}
                  >
                    Stage: {grow.growth_cycle.replace("_", " ")}
                  </p>
                )}
              </div>
            </div>

            {/* Active indicator */}
            {isActive && (
              <div className="flex items-center space-x-2 text-blue-600 flex-shrink-0">
                <span className="text-xs font-medium bg-blue-100 px-2 py-1 rounded-full">
                  ACTIVE
                </span>
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
        </button>
      </form>

      {/* Delete button - Client Component */}
      <DeleteButton growId={grow.id} growName={grow.strain} />
    </div>
  );
}

// Active grow summary component
function ActiveGrowSummary({ grows }: { grows: any[] }) {
  const activeGrow = grows.find((grow) => grow.currently_selected === "true");

  if (!activeGrow) {
    return (
      <div className="mt-6 mx-auto bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg
            className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-yellow-800">
              No Active Grow Selected
            </h3>
            <p className="text-sm text-yellow-700 mt-1">
              Click on a grow above to make it active and access grow-specific
              features like irrigation scheduling and lighting controls.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 mx-auto bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-3 flex-shrink-0 mt-1"></div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-green-900">
              Active Grow: {activeGrow.strain}
            </h3>
            <p className="text-sm text-green-700 mt-1">
              {activeGrow.grow_notes}
            </p>
            {activeGrow.growth_cycle && (
              <p className="text-xs text-green-600 mt-2 capitalize inline-block bg-green-100 px-2 py-1 rounded-full">
                {activeGrow.growth_cycle.replace("_", " ")}
              </p>
            )}
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0 ml-4">
          <a
            href="/dashboard/editGrow"
            className="text-xs bg-blue-100 text-blue-700 px-3 py-2 rounded-md hover:bg-blue-200 transition-colors text-center"
          >
            Edit Details
          </a>
          <a
            href="/dashboard/irrigationSchedule"
            className="text-xs bg-purple-100 text-purple-700 px-3 py-2 rounded-md hover:bg-purple-200 transition-colors text-center"
          >
            Irrigation
          </a>
        </div>
      </div>
    </div>
  );
}
