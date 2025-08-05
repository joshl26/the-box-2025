// __tests__/setup.ts
import "@testing-library/jest-dom";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/dashboard"),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  })),
}));

// Mock Next.js cache functions
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
  usePathname: jest.fn(),
}));
