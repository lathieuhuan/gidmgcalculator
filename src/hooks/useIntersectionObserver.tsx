import { useState, useEffect, useRef, type DependencyList } from "react";
import { BooleanRecord } from "@Src/types";

export const useIntersectionObserver = <T extends HTMLElement>(dependecies: DependencyList = []) => {
  const observeAreaRef = useRef<T>(null);
  const [itemsVisible, setItemsVisible] = useState<BooleanRecord>({});

  const observedItemCN = "observed-item";

  useEffect(() => {
    const handleIntersection: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        const dataId = entry.target.getAttribute("data-id");

        if (entry.isIntersecting && dataId) {
          setItemsVisible((prevItemsVisible) => {
            const newItemsVisible = { ...prevItemsVisible };
            newItemsVisible[dataId] = true;
            return newItemsVisible;
          });
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      root: observeAreaRef.current,
    });

    observeAreaRef.current?.querySelectorAll(`.${observedItemCN}`).forEach((item) => {
      if (item) {
        observer.observe(item);
      }
    });

    return () => observer.disconnect();
  }, dependecies);

  return {
    ref: observeAreaRef,
    observedItemCN,
    itemsVisible,
  };
};
