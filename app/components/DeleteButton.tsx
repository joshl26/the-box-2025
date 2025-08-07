"use client";

import { deleteGrow } from "../actions";
import { useTransition } from "react";

interface DeleteButtonProps {
  growId: number;
  growName: string;
}

export default function DeleteButton({ growId, growName }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    const confirmed = confirm(
      `Are you sure you want to delete the grow "${growName}"?\n\nThis action cannot be undone and will permanently remove all associated data including:\n• Irrigation schedules\n• Lighting schedules\n• Growth cycle information\n• All notes and settings\n\nClick OK to confirm deletion or Cancel to keep the grow.`
    );

    if (confirmed) {
      startTransition(async () => {
        const formData = new FormData();
        formData.append("Id", growId.toString());

        try {
          const result = await deleteGrow(formData);
          if (result.success) {
            console.log("Grow deleted successfully!");
          } else {
            console.error("Delete failed:", result.error);
            alert("Failed to delete grow: " + result.error);
          }
        } catch (error) {
          console.error("Delete error:", error);
          alert("An error occurred while deleting the grow.");
        }
      });
    }
  };

  return (
    <div className="flex-shrink-0 border-b border-gray-200">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="h-full px-3 py-3 text-red-600 hover:text-red-800 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-inset transition-colors duration-200 border-l border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Delete this grow"
      >
        {isPending ? (
          <svg
            className="w-4 h-4 animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        ) : (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
