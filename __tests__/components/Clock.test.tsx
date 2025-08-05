// __tests__/components/Clock.test.tsx
import React from "react";
import { render, screen, act } from "@testing-library/react";
import LiveClock, { DigitalClock } from "../../app/components/Clock";

// Mock Date to have consistent tests
const mockDate = new Date("2024-01-01T12:00:00Z");
jest.useFakeTimers();

beforeEach(() => {
  jest.setSystemTime(mockDate);
});

afterEach(() => {
  jest.useRealTimers();
});

describe("LiveClock Component", () => {
  test("renders loading state initially", () => {
    render(<LiveClock />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("displays time after mounting", () => {
    render(<LiveClock />);

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(screen.getByText(/12:00/)).toBeInTheDocument();
  });

  test("updates time every second", () => {
    render(<LiveClock />);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Should show updated time
    expect(screen.getByText(/12:00/)).toBeInTheDocument();
  });

  test("renders with custom format", () => {
    render(<LiveClock format="24" showSeconds={false} />);

    act(() => {
      jest.runOnlyPendingTimers();
    });

    // Should show 24-hour format
    expect(screen.queryByText(/AM|PM/)).not.toBeInTheDocument();
  });
});

describe("DigitalClock Component", () => {
  test("renders with correct styling", () => {
    render(<DigitalClock />);

    const clockElement = screen.getByText("Loading...").parentElement;
    expect(clockElement).toHaveClass("bg-black", "text-green-400");
  });
});
