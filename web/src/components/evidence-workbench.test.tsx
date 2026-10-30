// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { EvidenceWorkbench } from "@/components/evidence-workbench";
import { reviewedAnswer } from "@/lib/evidence";

describe("EvidenceWorkbench reliability", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("prevents duplicate submissions while a request is pending", async () => {
    let resolveRequest: ((response: Response) => void) | undefined;
    const fetchMock = vi.fn(
      () =>
        new Promise<Response>((resolve) => {
          resolveRequest = resolve;
        }),
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<EvidenceWorkbench initialAnswer={reviewedAnswer} />);
    const submitButton = screen.getByRole("button", {
      name: /analyze evidence/i,
    });
    const form = submitButton.closest("form");
    expect(form).not.toBeNull();

    fireEvent.submit(form!);
    fireEvent.submit(form!);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole("button", { name: /tracing evidence/i }),
    ).toBeDisabled();

    resolveRequest?.(
      new Response(JSON.stringify(reviewedAnswer), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await waitFor(() => expect(submitButton).toBeEnabled());
  });

  it("ends loading, explains failure, and allows retry", async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error("Simulated Meta service failure"))
      .mockResolvedValueOnce(
        new Response(JSON.stringify(reviewedAnswer), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );
    vi.stubGlobal("fetch", fetchMock);

    render(<EvidenceWorkbench initialAnswer={reviewedAnswer} />);
    const submitButton = screen.getByRole("button", {
      name: /analyze evidence/i,
    });

    fireEvent.click(submitButton);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Simulated Meta service failure",
    );
    expect(submitButton).toBeEnabled();

    fireEvent.click(submitButton);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    await waitFor(() =>
      expect(screen.queryByRole("alert")).not.toBeInTheDocument(),
    );
    expect(submitButton).toBeEnabled();
  });
});
