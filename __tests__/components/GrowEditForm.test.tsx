// __tests__/components/GrowEditForm.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GrowEditForm from "../../app/components/GrowEditForm";
import { updateRecord } from "../../app/actions";

jest.mock("../../app/actions", () => ({
  updateRecord: jest.fn(),
}));

const mockGrow = {
  Id: 1,
  strain: "Test Strain",
  grow_notes: "Test notes",
  currently_selected: "false",
  growth_cycle: "veg_growth",
};

describe("GrowEditForm Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders form with grow data", () => {
    render(<GrowEditForm grow={mockGrow} />);

    expect(screen.getByDisplayValue("Test Strain")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test notes")).toBeInTheDocument();
  });

  test("validates required fields", async () => {
    render(<GrowEditForm grow={mockGrow} />);

    const strainInput = screen.getByDisplayValue("Test Strain");
    fireEvent.change(strainInput, { target: { value: "" } });

    const submitButton = screen.getByText("Update Grow Details");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Strain is required")).toBeInTheDocument();
    });
  });

  test("calls updateRecord on successful form submission", async () => {
    const mockUpdateRecord = updateRecord as jest.MockedFunction<
      typeof updateRecord
    >;
    mockUpdateRecord.mockResolvedValue({
      success: true,
      updatedRecord: { ...mockGrow, strain: "Updated Strain" },
    });

    const mockOnSuccess = jest.fn();
    render(<GrowEditForm grow={mockGrow} onSuccess={mockOnSuccess} />);

    const strainInput = screen.getByDisplayValue("Test Strain");
    fireEvent.change(strainInput, { target: { value: "Updated Strain" } });

    const submitButton = screen.getByText("Update Grow Details");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateRecord).toHaveBeenCalledWith("1", "grows", {
        strain: "Updated Strain",
        grow_notes: "Test notes",
        currently_selected: "false",
        growth_cycle: "veg_growth",
      });
    });
  });

  test("shows success message after successful update", async () => {
    const mockUpdateRecord = updateRecord as jest.MockedFunction<
      typeof updateRecord
    >;
    mockUpdateRecord.mockResolvedValue({
      success: true,
      updatedRecord: mockGrow,
    });

    render(<GrowEditForm grow={mockGrow} />);

    const submitButton = screen.getByText("Update Grow Details");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Grow details updated successfully!")
      ).toBeInTheDocument();
    });
  });

  test("shows error message on failed update", async () => {
    const mockUpdateRecord = updateRecord as jest.MockedFunction<
      typeof updateRecord
    >;
    mockUpdateRecord.mockResolvedValue({
      success: false,
      error: "Database error",
    });

    render(<GrowEditForm grow={mockGrow} />);

    const submitButton = screen.getByText("Update Grow Details");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Database error")).toBeInTheDocument();
    });
  });
});
