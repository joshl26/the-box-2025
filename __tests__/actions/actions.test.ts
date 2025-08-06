// __tests__/actions/actions.test.ts
import {
  fetchGrows,
  fetchCurrentlySelectedGrow,
  updateRecord,
  createGrow,
  deleteGrow,
} from "../../app/actions";

// Mock the database pool
jest.mock("../../db/db", () => ({
  query: jest.fn(),
}));

// Mock Next.js cache functions
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

import pool from "../../db/db";

const mockPool = pool as jest.Mocked<typeof pool>;

describe("Server Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchGrows", () => {
    test("returns grows successfully", async () => {
      const mockGrows = [
        { Id: 1, strain: "Test Strain", grow_notes: "Test notes" },
      ];

      mockPool.query.mockResolvedValue({ rows: mockGrows });

      const result = await fetchGrows();

      expect(result.success).toBe(true);
      expect(result.fetchGrows).toEqual(mockGrows);
      expect(mockPool.query).toHaveBeenCalledWith(
        'SELECT * FROM grows ORDER BY "Id" ASC'
      );
    });

    test("handles database error", async () => {
      mockPool.query.mockRejectedValue(new Error("Database error"));

      const result = await fetchGrows();

      expect(result.success).toBe(false);
      expect(result.error).toBe("Failed to update record.");
    });
  });

  describe("fetchCurrentlySelectedGrow", () => {
    test("returns currently selected grow", async () => {
      const mockGrow = {
        Id: 1,
        strain: "Active Strain",
        currently_selected: "true",
      };

      mockPool.query.mockResolvedValue({ rows: [mockGrow] });

      const result = await fetchCurrentlySelectedGrow();

      expect(result.success).toBe(true);
      expect(result.fetchCurrentlySelectedGrow).toEqual(mockGrow);
    });
  });

  describe("updateRecord", () => {
    test("updates record successfully", async () => {
      const mockUpdatedRecord = { Id: 1, strain: "Updated Strain" };

      mockPool.query.mockResolvedValue({ rows: [mockUpdatedRecord] });

      const result = await updateRecord("1", "grows", {
        strain: "Updated Strain",
      });

      expect(result.success).toBe(true);
      expect(result.updatedRecord).toEqual(mockUpdatedRecord);
    });

    test("constructs correct SQL query", async () => {
      mockPool.query.mockResolvedValue({ rows: [{}] });

      await updateRecord("1", "grows", {
        strain: "New Strain",
        grow_notes: "New notes",
      });

      expect(mockPool.query).toHaveBeenCalledWith(
        'UPDATE grows SET "strain" = $2, "grow_notes" = $3 WHERE "Id" = $1 RETURNING *;',
        ["1", "New Strain", "New notes"]
      );
    });
  });

  describe("createGrow", () => {
    test("creates grow successfully", async () => {
      const formData = new FormData();
      formData.append("strain", "New Strain");
      formData.append("grow_notes", "New grow notes");

      const mockCreatedGrow = {
        Id: 2,
        strain: "New Strain",
        grow_notes: "New grow notes",
      };
      mockPool.query.mockResolvedValue({ rows: [mockCreatedGrow] });

      const result = await createGrow(formData);

      expect(result.success).toBe(true);
      expect(result.grow).toEqual(mockCreatedGrow);
    });

    test("validates required fields", async () => {
      const formData = new FormData();
      formData.append("strain", "");
      formData.append("grow_notes", "Notes");

      const result = await createGrow(formData);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Strain and grow notes are required.");
    });
  });

  describe("deleteGrow", () => {
    test("deletes grow successfully", async () => {
      const formData = new FormData();
      formData.append("Id", "1");

      const mockDeletedGrow = { Id: 1, strain: "Deleted Strain" };
      mockPool.query.mockResolvedValue({ rows: [mockDeletedGrow] });

      const result = await deleteGrow(formData);

      expect(result.success).toBe(true);
      expect(result.message).toBe("Grow deleted successfully");
    });

    test("handles grow not found", async () => {
      const formData = new FormData();
      formData.append("Id", "999");

      mockPool.query.mockResolvedValue({ rows: [] });

      const result = await deleteGrow(formData);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Grow not found.");
    });
  });
});
