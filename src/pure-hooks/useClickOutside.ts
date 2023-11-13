import { useEffect, RefObject } from "react";

export type ClickOutsideHandler = (target: HTMLElement) => void;

export const useClickOutside = <T extends HTMLElement>(ref: RefObject<T>, handler: ClickOutsideHandler) => {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (e.target instanceof HTMLElement && !ref.current?.contains(e.target)) {
        handler(e.target);
      }
    };

    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, []);
};
