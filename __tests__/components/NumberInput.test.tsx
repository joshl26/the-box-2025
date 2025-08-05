// __tests__/components/NumberInput.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NumberInput from "../../app/components/NumberInput";

describe("NumberInput Component", () => {
  test("renders with initial value", () => {
    render(<NumberInput id="test" initialValue={5} />);
    expect(screen.getByDisplayValue("5")).toBeInTheDocument();
  });

  test("increments value when up button is clicked", () => {
    render(<NumberInput id="test" initialValue={5} step={1} />);

    const upButton = screen.getByText("↑");
    fireEvent.click(upButton);

    expect(screen.getByDisplayValue("6")).toBeInTheDocument();
  });

  test("decrements value when down button is clicked", () => {
    render(<NumberInput id="test" initialValue={5} step={1} />);

    const downButton = screen.getByText("↓");
    fireEvent.click(downButton);

    expect(screen.getByDisplayValue("4")).toBeInTheDocument();
  });

  test("respects min constraint", () => {
    render(<NumberInput id="test" initialValue={0} min={0} />);

    const downButton = screen.getByText("↓");
    fireEvent.click(downButton);

    // Should stay at 0
    expect(screen.getByDisplayValue("0")).toBeInTheDocument();
    expect(downButton).toBeDisabled();
  });

  test("respects max constraint", () => {
    render(<NumberInput id="test" initialValue={10} max={10} />);

    const upButton = screen.getByText("↑");
    fireEvent.click(upButton);

    // Should stay at 10
    expect(screen.getByDisplayValue("10")).toBeInTheDocument();
    expect(upButton).toBeDisabled();
  });

  test("handles direct input change", () => {
    render(<NumberInput id="test" initialValue={5} />);

    const input = screen.getByDisplayValue("5");
    fireEvent.change(input, { target: { value: "15" } });

    expect(screen.getByDisplayValue("15")).toBeInTheDocument();
  });
});
