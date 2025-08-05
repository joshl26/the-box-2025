// __tests__/components/DropdownMenu.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DropdownMenu from "../../app/components/DropdownMenu";
import { handleMenuAction } from "../../app/actions";

// Mock the server action
jest.mock("../../app/actions", () => ({
  handleMenuAction: jest.fn(),
}));

const mockOptions = [
  { id: "1", label: "Option 1", value: "value1", action: "action1" },
  { id: "2", label: "Option 2", value: "value2", action: "action2" },
];

describe("DropdownMenu Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders with placeholder text", () => {
    render(<DropdownMenu options={mockOptions} placeholder="Select option" />);
    expect(screen.getByText("Select option")).toBeInTheDocument();
  });

  test("opens dropdown when clicked", () => {
    render(<DropdownMenu options={mockOptions} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  test("calls server action when option is selected", async () => {
    const mockHandleMenuAction = handleMenuAction as jest.MockedFunction<
      typeof handleMenuAction
    >;
    mockHandleMenuAction.mockResolvedValue({
      success: true,
      message: "Action completed",
      timestamp: "2024-01-01T12:00:00Z",
    });

    render(<DropdownMenu options={mockOptions} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    const option1 = screen.getByText("Option 1");
    fireEvent.click(option1);

    await waitFor(() => {
      expect(mockHandleMenuAction).toHaveBeenCalledWith("action1", "value1");
    });
  });

  test("shows loading state during server action", async () => {
    const mockHandleMenuAction = handleMenuAction as jest.MockedFunction<
      typeof handleMenuAction
    >;
    mockHandleMenuAction.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    render(<DropdownMenu options={mockOptions} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    const option1 = screen.getByText("Option 1");
    fireEvent.click(option1);

    expect(screen.getByText("Processing...")).toBeInTheDocument();
  });
});
