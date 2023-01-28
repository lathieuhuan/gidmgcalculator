import { useEffect, RefObject } from "react";

export const useClickOutside = <T extends HTMLElement>(ref: RefObject<T>, callback: () => void) => {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (e.target instanceof HTMLElement && !ref.current?.contains(e.target)) {
        callback();
      }
    };

    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, []);
};
