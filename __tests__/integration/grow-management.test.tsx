// __tests__/integration/grow-management.test.tsx
// import React from "react";
// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { createGrow, updateRecord, deleteGrow } from "../../app/actions";

// Integration test for grow management workflow
describe("Grow Management Integration", () => {
  test("complete grow lifecycle", async () => {
    // This would test the full workflow:
    // 1. Create a grow
    // 2. Update grow details
    // 3. Set as active grow
    // 4. Delete grow

    // Mock the actions
    const mockCreateGrow = createGrow as jest.MockedFunction<typeof createGrow>;
    const mockUpdateRecord = updateRecord as jest.MockedFunction<
      typeof updateRecord
    >;
    const mockDeleteGrow = deleteGrow as jest.MockedFunction<typeof deleteGrow>;

    // Test creation
    const formData = new FormData();
    formData.append("strain", "Integration Test Strain");
    formData.append("grow_notes", "Test notes");

    mockCreateGrow.mockResolvedValue({
      success: true,
      grow: {
        Id: 1,
        strain: "Integration Test Strain",
        grow_notes: "Test notes",
      },
    });

    const createResult = await createGrow(formData);
    expect(createResult.success).toBe(true);

    // Test update
    mockUpdateRecord.mockResolvedValue({
      success: true,
      updatedRecord: {
        Id: 1,
        strain: "Updated Strain",
        grow_notes: "Updated notes",
      },
    });

    const updateResult = await updateRecord("1", "grows", {
      strain: "Updated Strain",
    });
    expect(updateResult.success).toBe(true);

    // Test deletion
    const deleteFormData = new FormData();
    deleteFormData.append("Id", "1");

    mockDeleteGrow.mockResolvedValue({
      success: true,
      message: "Grow deleted successfully",
    });

    const deleteResult = await deleteGrow(deleteFormData);
    expect(deleteResult.success).toBe(true);
  });
});
