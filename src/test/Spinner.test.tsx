import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Spinner from "../shared/components/ui/Spinner";

describe("Spinner", () => {
  it("renders with default size", () => {
    const { container } = render(<Spinner />);
    const outerSpan = container.firstChild;
    expect(outerSpan).toHaveClass("gap-1.5");
    expect(outerSpan?.firstChild).toHaveClass("w-2 h-2");
  });

  it("renders with sm size", () => {
    const { container } = render(<Spinner size="sm" />);
    const outerSpan = container.firstChild;
    expect(outerSpan).toHaveClass("gap-1");
    expect(outerSpan?.firstChild).toHaveClass("w-1.5 h-1.5");
  });

  it("renders with lg size", () => {
    const { container } = render(<Spinner size="lg" />);
    const outerSpan = container.firstChild;
    expect(outerSpan).toHaveClass("gap-2");
    expect(outerSpan?.firstChild).toHaveClass("w-2.5 h-2.5");
  });
});
