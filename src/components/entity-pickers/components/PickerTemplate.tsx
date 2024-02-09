import clsx from "clsx";
import { useState, ReactNode, useRef, useEffect, useLayoutEffect } from "react";
import { FaFilter, FaSearch } from "react-icons/fa";

import { useIntersectionObserver } from "@Src/pure-hooks";
import { useScreenWatcher } from "@Src/features";

// Component
import { Modal, Button, ItemCase, Checkbox, Input, Drawer, DrawerProps, Popover } from "@Src/pure-components";
import { PickerItem, PickerItemModel } from "./PickerItem";

/** this pick is valid or not */
type Return = boolean;

export type OnPickItemReturn = Return | Promise<Return>;

export interface PickerTemplateProps<T extends PickerItemModel = PickerItemModel> {
  title: string;
  data: T[];
  hiddenCodes?: Set<number>;
  /** Default to 'No data' */
  emptyText?: string;
  /** Only in multiple mode, implemented in afterPickItem */
  shouldHidePickedItem?: boolean;
  hasMultipleMode?: boolean;
  hasConfigStep?: boolean;
  hasSearch?: boolean;
  hasFilter?: boolean;
  /** Default to 360px */
  filterWrapWidth?: DrawerProps["activeWidth"];
  /** Default to true */
  filterToggleable?: boolean;
  initialFilterOn?: boolean;
  renderFilter?: (setFilterOn: (on: boolean) => void) => ReactNode;
  /** Remember to handle case shouldHidePickedItem */
  renderItemConfig?: (afterPickItem: (code: number) => void) => ReactNode;
  onPickItem?: (item: T, isConfigStep: boolean) => OnPickItemReturn;
  onClose: () => void;
}
export const PickerTemplate = <T extends PickerItemModel = PickerItemModel>({
  title,
  data,
  hiddenCodes,
  emptyText = "No data",
  shouldHidePickedItem,
  hasMultipleMode,
  hasConfigStep,
  hasSearch,
  hasFilter,
  filterWrapWidth = 360,
  filterToggleable = true,
  initialFilterOn = false,
  renderFilter,
  renderItemConfig,
  onPickItem,
  onClose,
}: PickerTemplateProps<T>) => {
  const screenWatcher = useScreenWatcher();
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutId = useRef<NodeJS.Timeout>();

  const [filterOn, setFilterOn] = useState(initialFilterOn);
  const [searchOn, setSearchOn] = useState(false);
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [chosenCode, setChosenCode] = useState(0);
  const [itemCounts, setItemCounts] = useState<Record<number, number>>({});
  const [pickedCodes, setPickedCodes] = useState(new Set<number>());
  const [keyword, setKeyword] = useState("");
  const [empty, setEmpty] = useState(false);
  const [overflow, setOverflow] = useState(true);

  const { observedAreaRef, observedItemCls, visibleItems } = useIntersectionObserver<HTMLDivElement>();

  useEffect(() => {
    const focus = (e: KeyboardEvent) => {
      if (hasSearch && e.key.length === 1 && document.activeElement !== inputRef.current) {
        inputRef.current?.focus();
      }
    };
    document.body.addEventListener("keydown", focus);

    return () => {
      document.body.removeEventListener("keydown", focus);
    };
  }, []);

  useLayoutEffect(() => {
    if (searchOn) inputRef.current?.focus();
  }, [searchOn]);

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

  const toggleFilter = (on?: boolean) => {
    if (filterToggleable) setFilterOn(on ?? !filterOn);
  };

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

  let searchTool: JSX.Element | null = null;
  const searchInput = (
    <Input
      ref={inputRef}
      className="w-28 px-2 py-1 text-base leading-5 font-semibold shadow-common"
      placeholder="Search..."
      disabled={filterOn}
      value={keyword}
      onChange={(value) => {
        clearTimeout(timeoutId.current);

        timeoutId.current = setTimeout(() => {
          setKeyword(value);
        }, 150);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.currentTarget.value.length) {
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
      }}
    />
  );

  if (hasSearch) {
    if (screenWatcher.isFromSize("sm")) {
      searchTool = searchInput;
    } else {
      searchTool = (
        <div className="relative">
          <Button
            className="shadow-common"
            variant={searchOn ? "neutral" : "default"}
            shape="square"
            size="small"
            disabled={filterOn}
            icon={<FaSearch />}
            onClick={() => {
              const newSearchOn = !searchOn;
              setSearchOn(newSearchOn);
              if (!newSearchOn) setKeyword("");
            }}
          />

          <Popover as="div" active={searchOn} className="mt-4" origin="top-left">
            {searchInput}
          </Popover>
        </div>
      );
    }
  }

  const itemWidthCls = [
    "max-w-1/3 basis-1/3 sm:w-1/4 sm:basis-1/4",
    hasConfigStep
      ? "xm:max-w-1/3 xm:basis-1/3 lg:max-w-1/5 lg:basis-1/5"
      : "md:max-w-1/5 md:basis-1/5 xm:max-w-1/6 xm:basis-1/6 lg:max-w-1/8 lg:basis-1/8",
  ];

  const renderData = () => {
    const shouldCheckKeyword = keyword.length >= 1;
    const lowerKeyword = keyword.toLowerCase();

    return (
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
              className={clsx("grow-0 relative p-2", observedItemCls, itemWidthCls, hidden && "hidden")}
            >
              <ItemCase chosen={item.code === chosenCode} onClick={() => onClickPickerItem(item)}>
                <PickerItem visible={visibleItems[item.code]} item={item} pickedAmount={itemCounts[item.code] || 0} />
              </ItemCase>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col rounded-lg shadow-white-glow">
      <Modal.CloseButton onClick={onClose} />

      <Modal.Header withDivider>
        <div className="flex items-center justify-between relative">
          <div>{title}</div>

          <div className="mr-4 pr-4 flex items-center">
            <div className="flex items-center gap-3">
              {searchTool}

              {hasFilter ? (
                <Button
                  className="shadow-common"
                  variant={filterOn ? "neutral" : "default"}
                  shape="square"
                  size="small"
                  icon={<FaFilter />}
                  disabled={!filterToggleable}
                  onClick={() => toggleFilter()}
                />
              ) : null}
            </div>

            {hasMultipleMode ? (
              <label
                className={clsx(
                  "pl-2 h-6 flex items-center",
                  (hasSearch || hasFilter) && "ml-2 border-l border-dark-300"
                )}
              >
                <Checkbox className="mr-2" onChange={setIsMultiSelect} />
                <span className="text-base text-light-400">Multiple</span>
              </label>
            ) : null}
          </div>
        </div>
      </Modal.Header>

      <div className="p-3 pb-4 sm:p-4 grow overflow-hidden relative">
        <div ref={bodyRef} className="h-full flex custom-scrollbar gap-4 scroll-smooth">
          <div
            ref={observedAreaRef}
            className={clsx(
              "h-full w-full shrink-0 md:w-auto md:shrink md:min-w-[400px] xm:min-w-0 grow custom-scrollbar",
              overflow && "xm:pr-2",
              searchOn && "pt-6"
            )}
          >
            {renderData()}

            {empty ? <p className="py-4 text-light-800 text-lg text-center">{emptyText}</p> : null}
          </div>

          {hasConfigStep ? <div className="overflow-auto shrink-0">{renderItemConfig?.(afterPickItem)}</div> : null}
        </div>

        <Drawer
          active={filterOn}
          activeWidth={screenWatcher.isFromSize("sm") ? filterWrapWidth : "100%"}
          closeOnMaskClick={filterToggleable}
          onClose={() => toggleFilter(false)}
        >
          {renderFilter?.(setFilterOn)}
        </Drawer>
      </div>
    </div>
  );
};
