import clsx, { ClassValue } from "clsx";
import { useState, ReactNode, useRef, useEffect } from "react";
import { FaFilter, FaSearch } from "react-icons/fa";

import type { PickerItem } from "../types";
import { useIntersectionObserver } from "@Src/pure-hooks";

// Component
import { Modal, Button, ItemCase, Checkbox, Input, CollapseSpace } from "@Src/pure-components";
import { ItemThumbnail } from "./ItemThumbnail";

/** this pick is valid or not */
type Return = boolean;

export type OnPickItemReturn = Return | Promise<Return>;

export interface PickerTemplateProps<T extends PickerItem = PickerItem> {
  title: string;
  data: T[];
  /** Only in multiple mode, implemented in afterPickItem */
  shouldHidePickedItem?: boolean;
  hasMultipleMode?: boolean;
  hasConfigStep?: boolean;
  hasSearch?: boolean;
  hasFilter?: boolean;
  /** Default to true */
  filterToggleable?: boolean;
  initialFilterOn?: boolean;
  filterWrapCls?: ClassValue;
  renderFilter?: (setFilterOn: (on: boolean) => void) => ReactNode;
  /** Remember to handle case shouldHidePickedItem */
  renderItemConfig?: (afterPickItem: (code: number) => void) => ReactNode;
  onChangeKeyword?: (keyword: string) => void;
  onPickItem?: (item: T, isConfigStep: boolean) => OnPickItemReturn;
  onClose: () => void;
}
export const PickerTemplate = <T extends PickerItem = PickerItem>({
  title,
  data,
  shouldHidePickedItem,
  hasMultipleMode,
  hasConfigStep,
  hasSearch,
  hasFilter,
  filterToggleable = true,
  initialFilterOn = false,
  filterWrapCls,
  renderFilter,
  renderItemConfig,
  onChangeKeyword,
  onPickItem,
  onClose,
}: PickerTemplateProps<T>) => {
  const bodyRef = useRef<HTMLDivElement>(null);

  const [activeTool, setActiveTool] = useState<"FILTER" | "SEARCH" | "">(initialFilterOn ? "SEARCH" : "");
  // const [filterOn, setFilterOn] = useState(initialFilterOn);
  // const [searchOn, setSearchOn] = useState(false);
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [chosenCode, setChosenCode] = useState(0);
  const [itemCounts, setItemCounts] = useState<Record<number, number>>({});

  const { observedAreaRef, observedItemCls, visibleItems } = useIntersectionObserver<HTMLDivElement>();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleFilter = () => {
    // if (filterToggleable) setFilterOn(!filterOn);
    console.log(activeTool);

    if (filterToggleable) setActiveTool(activeTool === "FILTER" ? "" : "FILTER");
  };

  const afterPickItem = (itemCode: number) => {
    if (isMultiSelect) {
      if (shouldHidePickedItem) {
        observedAreaRef.current?.querySelector(`.${observedItemCls}[data-id="${itemCode}"]`)?.classList.add("hidden");
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
      await onPickItem(item, true);
      setChosenCode(item.code);
      if (bodyRef.current) bodyRef.current.scrollLeft = 999;
      return;
    }

    if (await onPickItem(item, false)) {
      afterPickItem(item.code);
    }
  };

  const itemWidth = hasConfigStep
    ? "max-w-1/3 basis-1/3 lg:max-w-1/5 lg:basis-1/5"
    : "max-w-1/3 basis-1/3 md1:max-w-1/5 md1:basis-1/5 md2:max-w-1/6 md2:basis-1/6 lg:max-w-1/8 lg:basis-1/8";

  return (
    <div className="h-full flex flex-col rounded-lg shadow-white-glow">
      <Modal.CloseButton onClick={onClose} />

      <Modal.Header withDivider>
        <div className="flex items-center justify-between relative">
          <div>{title}</div>

          <div className="mr-6 pr-4 flex items-center">
            <div className="flex items-center gap-3">
              {hasSearch ? (
                <Button
                  className="shadow-common"
                  // variant={searchOn ? "neutral" : "default"}
                  variant={activeTool === "SEARCH" ? "neutral" : "default"}
                  shape="square"
                  size="small"
                  icon={<FaSearch />}
                  // onClick={() => setSearchOn(!searchOn)}
                  onClick={() => setActiveTool(activeTool === "SEARCH" ? "" : "SEARCH")}
                />
              ) : null}
              {hasFilter ? (
                <Button
                  className="shadow-common"
                  // variant={filterOn ? "neutral" : "default"}
                  variant={activeTool === "FILTER" ? "neutral" : "default"}
                  shape="square"
                  size="small"
                  icon={<FaFilter />}
                  disabled={!filterToggleable}
                  onClick={toggleFilter}
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

      <div className="p-4 grow overflow-hidden relative">
        <CollapseSpace active={activeTool === "SEARCH"}>
          <div className="pb-2 flex justify-center">
            <Input
              className="w-24 ml-3 px-2 py-1 leading-5 font-semibold shadow-common"
              placeholder="Search..."
              onChange={onChangeKeyword}
              // onKeyDown={onKeyDown}
            />
          </div>
        </CollapseSpace>

        <div ref={bodyRef} className="h-full flex custom-scrollbar gap-4 scroll-smooth">
          <div
            ref={observedAreaRef}
            className="md2:pr-2 h-full w-full shrink-0 md1:w-auto md1:shrink md1:min-w-[352px] grow custom-scrollbar"
          >
            <div className="flex flex-wrap">
              {data.map((item, i) => {
                return (
                  <div
                    key={`${item.code}-${item.rarity}`}
                    data-id={item.code}
                    className={clsx(
                      "grow-0 relative",
                      observedItemCls,
                      itemWidth,
                      item.vision ? "p-1.5 sm:pt-3 sm:pr-3 md1:p-2" : "p-1.5 sm:p-2"
                      // { hidden: dataType === "character" && !visibleNames[item.name] }
                    )}
                  >
                    <ItemCase chosen={item.code === chosenCode} onClick={() => onClickPickerItem(item)}>
                      <ItemThumbnail
                        visible={visibleItems[item.code]}
                        item={item}
                        pickedAmount={itemCounts[item.code] || 0}
                      />
                    </ItemCase>
                  </div>
                );
              })}
            </div>
          </div>

          {hasConfigStep ? <div className="overflow-auto shrink-0">{renderItemConfig?.(afterPickItem)}</div> : null}
        </div>

        <div
          className={clsx("absolute full-stretch z-10 bg-black/60 hidden", activeTool === "FILTER" && "md1:block")}
          onClick={toggleFilter}
        />

        <div
          className={clsx(
            "absolute top-0 left-full z-10 h-full transition-transform duration-300",
            // filterOn && "-translate-x-full",
            activeTool === "FILTER" && "-translate-x-full",
            !mounted && "hidden",
            filterWrapCls
          )}
        >
          {/* {renderFilter?.(setFilterOn)} */}
          {renderFilter?.((on) => setActiveTool(on ? "FILTER" : ""))}
        </div>
      </div>
    </div>
  );
};
