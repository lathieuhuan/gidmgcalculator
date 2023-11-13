import { useState, useEffect, useRef, type DependencyList } from "react";
import { BooleanRecord } from "@Src/types";

export const useIntersectionObserver = <T extends HTMLElement>(dependecies: DependencyList = []) => {
  const observedAreaRef = useRef<T>(null);
  const [visibleItems, setVisibleItems] = useState<BooleanRecord>({});

  const observedItemCls = "observed-item";

  useEffect(() => {
    const handleIntersection: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        const dataId = entry.target.getAttribute("data-id");

        if (entry.isIntersecting && dataId) {
          setVisibleItems((prevItemsVisible) => {
            const newItemsVisible = { ...prevItemsVisible };
            newItemsVisible[dataId] = true;
            return newItemsVisible;
          });
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      root: observedAreaRef.current,
    });

    observedAreaRef.current?.querySelectorAll(`.${observedItemCls}`).forEach((item) => {
      if (item) {
        observer.observe(item);
      }
    });

    return () => observer.disconnect();
  }, dependecies);

  return {
    observedAreaRef,
    observedItemCls,
    visibleItems,
  };
};
