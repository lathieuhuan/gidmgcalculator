import clsx, { ClassValue } from "clsx";
import { useState, useEffect, useRef, type DependencyList } from "react";
import { BooleanRecord } from "@Src/types";

const observedItemCls = "observed-item";
const observedIdKey = "data-id";

export const useIntersectionObserver = <T extends HTMLElement = HTMLDivElement>(dependecies: DependencyList = []) => {
  const observedAreaRef = useRef<T>(null);
  const [visibleItems, setVisibleItems] = useState<BooleanRecord>({});

  const getObservedItemProps = (id: string | number, className?: ClassValue) => {
    return {
      className: clsx(observedItemCls, className),
      [observedIdKey]: id,
    };
  };

  const queryAllObservedItems = () => {
    return observedAreaRef.current?.querySelectorAll(`.${observedItemCls}`);
  };

  const queryObservedItem = (id: string | number) => {
    return observedAreaRef.current?.querySelector(`.${observedItemCls}[${observedIdKey}="${id}"]`);
  };

  useEffect(() => {
    let visibleItemsRef = { ...visibleItems };

    const handleIntersection: IntersectionObserverCallback = (entries) => {
      let hasChanged = false;
      const newItemsVisible = { ...visibleItemsRef };

      entries.forEach((entry) => {
        const itemId = entry.target.getAttribute(observedIdKey);

        if (entry.isIntersecting && itemId && !newItemsVisible[itemId]) {
          newItemsVisible[itemId] = true;
          hasChanged = true;
        }
      });

      if (hasChanged) {
        setVisibleItems(newItemsVisible);
        visibleItemsRef = newItemsVisible;
      }
    };

    const observer = new IntersectionObserver(handleIntersection, {
      root: observedAreaRef.current,
    });

    queryAllObservedItems()?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, dependecies);

  return {
    observedAreaRef,
    observedItemCls,
    visibleItems,
    getObservedItemProps,
    queryAllObservedItems,
    queryObservedItem,
  };
};
