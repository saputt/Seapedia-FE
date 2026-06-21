import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Spinner from "../shared/components/ui/Spinner";

describe("Spinner", () => {
  it("renders with default size", () => {
    const { container } = render(<Spinner />);
    expect(container.firstChild).toHaveClass("w-6 h-6");
  });

  it("renders with sm size", () => {
    const { container } = render(<Spinner size="sm" />);
    expect(container.firstChild).toHaveClass("w-4 h-4");
  });

  it("renders with lg size", () => {
    const { container } = render(<Spinner size="lg" />);
    expect(container.firstChild).toHaveClass("w-8 h-8");
  });
});
