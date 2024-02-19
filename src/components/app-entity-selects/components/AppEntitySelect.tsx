import clsx from "clsx";
import { useState, ReactNode, useRef, useLayoutEffect } from "react";

import { useIntersectionObserver } from "@Src/pure-hooks";

// Component
import { ItemCase, DrawerProps } from "@Src/pure-components";
import { EntitySelectRenderArgs, EntitySelectTemplate } from "../../EntitySelectTemplate";
import { AppEntityOption, AppEntityOptionModel } from "./AppEntityOption";

/** this pick is valid or not */
type Return = boolean;

export type OptionValidity = Return | Promise<Return>;

interface SelectOptionsProps<T> {
  data: T[];
  hiddenCodes?: Set<number>;
  /** Default to 'No data' */
  emptyText?: string;
  hasConfigStep?: boolean;
  /** Only in multiple mode, implemented in afterSelect */
  shouldHideSelected?: boolean;
  /** Remember to handle case shouldHideSelected */
  renderOptionConfig?: (afterSelect: (code: number) => void) => ReactNode;
  onSelect?: (entity: T, isConfigStep: boolean) => OptionValidity;
  onClose: () => void;
}
function SelectOptions<T extends AppEntityOptionModel = AppEntityOptionModel>({
  data,
  shouldHideSelected,
  emptyText = "No data",
  hasConfigStep,
  hiddenCodes,
  renderOptionConfig,
  onSelect,
  onClose,
  isMultiSelect,
  keyword,
  searchOn,
  inputRef,
}: SelectOptionsProps<T> & EntitySelectRenderArgs) {
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
    // if (hasConfigStep && data.length && data[0]) {
    //   selectOption(data[0]);
    // }

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

            if (foundItem) selectOption(foundItem);
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
    let visibleElmts: Element[] = [];

    for (const elmt of itemElmts) {
      if (window.getComputedStyle(elmt).display !== "none") {
        visibleElmts.push(elmt);
      }
    }
    setEmpty(!visibleElmts.length);

    // select first visible item
    const firstElmtCode = visibleElmts[0]?.getAttribute("data-id");

    if (hasConfigStep && visibleElmts.length && firstElmtCode && +firstElmtCode !== chosenCode) {
      const firstItem = data.find((item) => item.code === +firstElmtCode);

      if (firstItem) {
        onSelect?.(firstItem, true);
        setChosenCode(firstItem.code);
      }
    }

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

  const afterSelect = (itemCode: number) => {
    if (isMultiSelect) {
      if (shouldHideSelected) {
        return setPickedCodes(new Set(pickedCodes).add(itemCode));
      }
      const newCounts = { ...itemCounts };
      newCounts[itemCode] = (newCounts[itemCode] || 0) + 1;

      return setItemCounts(newCounts);
    }

    onClose();
  };

  const selectOption = async (item: T) => {
    if (!onSelect) return;

    if (hasConfigStep) {
      if (item.code !== chosenCode) {
        await onSelect(item, true);
        setChosenCode(item.code);
        if (bodyRef.current) bodyRef.current.scrollLeft = 999;
      }
      return;
    }

    if (await onSelect(item, false)) {
      afterSelect(item.code);
    }
  };

  // const onDoubleClickPickerItem = async (item: T) => {
  //   if (!onSelect || !hasConfigStep) return;

  //   if (await onSelect(item, false)) {
  //     afterSelect(item.code);
  //   }
  // };

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
          searchOn && "pt-8"
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
                  onClick={() => selectOption(item)}
                  // onDoubleClick={() => onDoubleClickPickerItem(item)}
                >
                  {(className, imgCls) => (
                    <AppEntityOption
                      className={className}
                      imgCls={imgCls}
                      visible={visibleItems[item.code]}
                      item={item}
                      selectedAmount={itemCounts[item.code] || 0}
                    />
                  )}
                </ItemCase>
              </div>
            );
          })}
        </div>

        {empty ? <p className="py-4 text-light-800 text-lg text-center">{emptyText}</p> : null}
      </div>

      {hasConfigStep ? <div className="overflow-auto shrink-0">{renderOptionConfig?.(afterSelect)}</div> : null}
    </div>
  );
}

export interface AppEntitySelectProps<T extends AppEntityOptionModel = AppEntityOptionModel>
  extends SelectOptionsProps<T> {
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
export const AppEntitySelect = <T extends AppEntityOptionModel = AppEntityOptionModel>({
  data,
  hiddenCodes,
  emptyText,
  hasConfigStep,
  shouldHideSelected,
  renderOptionConfig,
  onSelect,
  onClose,
  ...restProps
}: AppEntitySelectProps<T>) => {
  return (
    <EntitySelectTemplate {...restProps} onClose={onClose}>
      {(arg) => {
        return (
          <SelectOptions
            onClose={onClose}
            {...arg}
            {...{ data, hiddenCodes, emptyText, hasConfigStep, shouldHideSelected, renderOptionConfig, onSelect }}
          />
        );
      }}
    </EntitySelectTemplate>
  );
};
