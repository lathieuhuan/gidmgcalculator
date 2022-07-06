import { useEffect } from "react";

export function useCloseWithEsc(close: () => void) {
  useEffect(() => {
    const handlePressEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handlePressEsc, true);
    return () => document.removeEventListener("keydown", handlePressEsc, true);
  }, []);
}
