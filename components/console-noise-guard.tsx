"use client";

import * as React from "react";

/**
 * Suppresses noisy third-party script errors that are outside our control.
 * Currently targets the reported `share-modal.js` error.
 */
export function ConsoleNoiseGuard() {
  React.useEffect(() => {
    const onError = (event: ErrorEvent) => {
      const filename = typeof event?.filename === "string" ? event.filename : "";
      if (filename.includes("share-modal.js")) {
        event.preventDefault();
        return false;
      }
      return undefined;
    };

    window.addEventListener("error", onError);
    return () => window.removeEventListener("error", onError);
  }, []);

  return null;
}
