import clsx, { ClassValue } from "clsx";
import { useState, useEffect, useRef, type DependencyList } from "react";
import { BooleanRecord } from "@Src/types";

const observedItemCls = "observed-item";
const observedIdKey = "data-id";

type ObservedItemId = string | number;

export class ObservedItem<U extends HTMLElement = HTMLDivElement> {
  element: U;

  constructor(element: U) {
    this.element = element;
  }

  getId = () => this.element.getAttribute(observedIdKey);

  isVisible = () => window.getComputedStyle(this.element).display !== "none";
}

type UseIntersectionObserverOptions = {
  dependecies?: DependencyList;
  ready?: boolean;
};
export const useIntersectionObserver = <T extends HTMLElement = HTMLDivElement, U extends HTMLElement = HTMLDivElement>(
  options?: UseIntersectionObserverOptions
) => {
  const observedAreaRef = useRef<T>(null);
  const [visibleMap, setVisibleItems] = useState<BooleanRecord>({});

  const { dependecies = [], ready = true } = options || {};

  const queryObservedItem = (id: ObservedItemId): ObservedItem<U> | null => {
    const element = observedAreaRef.current?.querySelector(`.${observedItemCls}[${observedIdKey}="${id}"]`);
    return element ? new ObservedItem(element as U) : null;
  };

  const queryAllObservedItems = (): Array<ObservedItem<U>> => {
    const items = observedAreaRef.current?.querySelectorAll(`.${observedItemCls}`);
    return items ? Array.from(items, (element) => new ObservedItem(element as U)) : [];
  };

  useEffect(() => {
    if (ready) {
      let visibleMapRef = { ...visibleMap };

      const handleIntersection: IntersectionObserverCallback = (entries) => {
        let hasChanged = false;
        const newVisibleMap = { ...visibleMapRef };

        entries.forEach((entry) => {
          const itemId = entry.target.getAttribute(observedIdKey);

          if (entry.isIntersecting && itemId && !newVisibleMap[itemId]) {
            newVisibleMap[itemId] = true;
            hasChanged = true;
          }
        });

        if (hasChanged) {
          setVisibleItems(newVisibleMap);
          visibleMapRef = newVisibleMap;
        }
      };

      const observer = new IntersectionObserver(handleIntersection, {
        root: observedAreaRef.current,
      });

      queryAllObservedItems().forEach((item) => observer.observe(item.element));

      return () => observer.disconnect();
    }
    return;
  }, dependecies);

  const getObservedItemProps = (id: string | number, className?: ClassValue) => {
    return {
      className: clsx(observedItemCls, className),
      [observedIdKey]: id,
    };
  };

  return {
    observedAreaRef,
    visibleMap,
    itemUtils: {
      getProps: getObservedItemProps,
      queryAll: queryAllObservedItems,
      queryById: queryObservedItem,
    },
  };
};
