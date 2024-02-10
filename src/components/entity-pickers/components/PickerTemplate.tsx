import clsx from "clsx";
import { useState, ReactNode, useRef, useLayoutEffect } from "react";

import { useIntersectionObserver } from "@Src/pure-hooks";

// Component
import { ItemCase, DrawerProps } from "@Src/pure-components";
import { EntitySelectRenderArgs, EntitySelectTemplate } from "@Src/components";
import { PickerItem, PickerItemModel } from "./PickerItem";

/** this pick is valid or not */
type Return = boolean;

export type OnPickItemReturn = Return | Promise<Return>;

interface PickerOptionsProps<T> {
  data: T[];
  hiddenCodes?: Set<number>;
  /** Default to 'No data' */
  emptyText?: string;
  hasConfigStep?: boolean;
  /** Only in multiple mode, implemented in afterPickItem */
  shouldHidePickedItem?: boolean;
  /** Remember to handle case shouldHidePickedItem */
  renderItemConfig?: (afterPickItem: (code: number) => void) => ReactNode;
  onPickItem?: (item: T, isConfigStep: boolean) => OnPickItemReturn;
  onClose: () => void;
}
function PickerOptions<T extends PickerItemModel = PickerItemModel>({
  data,
  shouldHidePickedItem,
  emptyText = "No data",
  hasConfigStep,
  hiddenCodes,
  renderItemConfig,
  onPickItem,
  onClose,
  isMultiSelect,
  keyword,
  searchOn,
  inputRef,
}: PickerOptionsProps<T> & EntitySelectRenderArgs) {
  const bodyRef = useRef<HTMLDivElement>(null);

  const [itemCounts, setItemCounts] = useState<Record<number, number>>({});
  const [pickedCodes, setPickedCodes] = useState(new Set<number>());
  const [chosenCode, setChosenCode] = useState(0);
  const [empty, setEmpty] = useState(false);
  const [overflow, setOverflow] = useState(true);

  const shouldCheckKeyword = keyword.length >= 1;
  const lowerKeyword = keyword.toLowerCase();

  const { observedAreaRef, observedItemCls, visibleItems } = useIntersectionObserver<HTMLDivElement>();

  useLayoutEffect(() => {
    const handleEnter = (e: KeyboardEvent) => {
      if (
        inputRef.current &&
        e.key === "Enter" &&
        document.activeElement === inputRef.current &&
        inputRef.current.value.length
      ) {
        const itemElmts = observedAreaRef.current?.querySelectorAll(`.${observedItemCls}`) || [];

        for (const elmt of itemElmts) {
          if (window.getComputedStyle(elmt).display !== "none") {
            const code = elmt.getAttribute("data-id");
            const foundItem = code ? data.find((item) => item.code === +code) : undefined;

            if (foundItem) onClickPickerItem(foundItem);
            return;
          }
        }
      }
    };

    document.addEventListener("keydown", handleEnter);

    return () => {
      document.removeEventListener("keydown", handleEnter);
    };
  }, []);

  useLayoutEffect(() => {
    // check if no item visible
    const itemElmts = observedAreaRef.current?.querySelectorAll(`.${observedItemCls}`) || [];
    let visibleElmtCount = 0;

    for (const elmt of itemElmts) {
      if (window.getComputedStyle(elmt).display !== "none") visibleElmtCount++;
    }
    setEmpty(!visibleElmtCount);

    // check if container overflow to add padding right
    const itemContainer = bodyRef.current?.querySelector(".item-container");
    const { parentElement } = itemContainer || {};
    const newOverflow = Boolean(
      itemContainer?.clientHeight &&
        parentElement?.clientHeight &&
        itemContainer.clientHeight > parentElement.clientHeight
    );
    if (newOverflow !== overflow) {
      setOverflow(newOverflow);
    }
  }, [hiddenCodes, pickedCodes, keyword]);

  const afterPickItem = (itemCode: number) => {
    if (isMultiSelect) {
      if (shouldHidePickedItem) {
        const newPickedCodes = new Set(pickedCodes).add(itemCode);

        setPickedCodes(newPickedCodes);
        return;
      }
      const newCounts = { ...itemCounts };
      newCounts[itemCode] = (newCounts[itemCode] || 0) + 1;

      return setItemCounts(newCounts);
    }

    onClose();
  };

  const onClickPickerItem = async (item: T) => {
    if (!onPickItem) return;

    if (hasConfigStep) {
      if (item.code !== chosenCode) {
        await onPickItem(item, true);
        setChosenCode(item.code);
        if (bodyRef.current) bodyRef.current.scrollLeft = 999;
      }
      return;
    }

    if (await onPickItem(item, false)) {
      afterPickItem(item.code);
    }
  };

  const onDoubleClickPickerItem = async (item: T) => {
    if (!onPickItem || !hasConfigStep) return;

    if (await onPickItem(item, false)) {
      afterPickItem(item.code);
    }
  };

  const itemWidthCls = [
    "max-w-1/3 basis-1/3 sm:w-1/4 sm:basis-1/4",
    hasConfigStep
      ? "xm:max-w-1/3 xm:basis-1/3 lg:max-w-1/5 lg:basis-1/5"
      : "md:max-w-1/5 md:basis-1/5 xm:max-w-1/6 xm:basis-1/6 lg:max-w-1/8 lg:basis-1/8",
  ];

  return (
    <div ref={bodyRef} className="h-full flex custom-scrollbar gap-4 scroll-smooth">
      <div
        ref={observedAreaRef}
        className={clsx(
          "h-full w-full shrink-0 md:w-auto md:shrink md:min-w-[400px] xm:min-w-0 grow custom-scrollbar",
          overflow && "xm:pr-2",
          searchOn && "pt-6"
        )}
      >
        <div className="item-container flex flex-wrap">
          {data.map((item, i) => {
            const hidden =
              pickedCodes.has(item.code) ||
              (shouldCheckKeyword && !item.name.toLowerCase().includes(lowerKeyword)) ||
              (hiddenCodes?.has(item.code) ?? false);

            return (
              <div
                key={item.code}
                data-id={item.code}
                data-name={item.name}
                className={clsx("grow-0 p-2 relative", observedItemCls, itemWidthCls, hidden && "hidden")}
              >
                <ItemCase
                  chosen={item.code === chosenCode}
                  onClick={() => onClickPickerItem(item)}
                  onDoubleClick={() => onDoubleClickPickerItem(item)}
                >
                  {(className) => (
                    <PickerItem
                      className={className}
                      visible={visibleItems[item.code]}
                      item={item}
                      pickedAmount={itemCounts[item.code] || 0}
                    />
                  )}
                </ItemCase>
              </div>
            );
          })}
        </div>

        {empty ? <p className="py-4 text-light-800 text-lg text-center">{emptyText}</p> : null}
      </div>

      {hasConfigStep ? <div className="overflow-auto shrink-0">{renderItemConfig?.(afterPickItem)}</div> : null}
    </div>
  );
}

export interface PickerTemplateProps<T extends PickerItemModel = PickerItemModel> extends PickerOptionsProps<T> {
  title: string;
  hasMultipleMode?: boolean;
  hasSearch?: boolean;
  hasFilter?: boolean;
  /** Default to 360px */
  filterWrapWidth?: DrawerProps["activeWidth"];
  /** Default to true */
  filterToggleable?: boolean;
  initialFilterOn?: boolean;
  renderFilter?: (setFilterOn: (on: boolean) => void) => ReactNode;
  onClose: () => void;
}
export const PickerTemplate = <T extends PickerItemModel = PickerItemModel>({
  data,
  hiddenCodes,
  emptyText,
  hasConfigStep,
  shouldHidePickedItem,
  renderItemConfig,
  onPickItem,
  onClose,
  ...restProps
}: PickerTemplateProps<T>) => {
  return (
    <EntitySelectTemplate {...restProps} onClose={onClose}>
      {(arg) => {
        return (
          <PickerOptions
            onClose={onClose}
            {...arg}
            {...{ data, hiddenCodes, emptyText, hasConfigStep, shouldHidePickedItem, renderItemConfig, onPickItem }}
          />
        );
      }}
    </EntitySelectTemplate>
  );
};
