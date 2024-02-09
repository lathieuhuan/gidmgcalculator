import clsx from "clsx";
import { useState, ReactNode, useRef, useEffect } from "react";
import { FaFilter, FaSearch } from "react-icons/fa";

import { useIntersectionObserver } from "@Src/pure-hooks";
import { useScreenWatcher } from "@Src/features";

// Component
import {
  Modal,
  Button,
  ItemCase,
  Checkbox,
  Input,
  CollapseSpace,
  HorizontalScroll,
  HorizontalScrollProps,
} from "@Src/pure-components";
import { PickerItem, PickerItemModel } from "./PickerItem";

/** this pick is valid or not */
type Return = boolean;

export type OnPickItemReturn = Return | Promise<Return>;

export interface PickerTemplateProps<T extends PickerItemModel = PickerItemModel> {
  title: string;
  data: T[];
  /** Default to 'No data' */
  emptyText?: string;
  /** Only in multiple mode, implemented in afterPickItem */
  shouldHidePickedItem?: boolean;
  hasMultipleMode?: boolean;
  hasConfigStep?: boolean;
  hasSearch?: boolean;
  hasFilter?: boolean;
  /** Default to 360px */
  filterWrapWidth?: HorizontalScrollProps["activeWidth"];
  /** Default to true */
  filterToggleable?: boolean;
  initialFilterOn?: boolean;
  renderFilter?: (setFilterOn: (on: boolean) => void) => ReactNode;
  /** Remember to handle case shouldHidePickedItem */
  renderItemConfig?: (afterPickItem: (code: number) => void) => ReactNode;
  onCancelFilter?: () => void;
  onPickItem?: (item: T, isConfigStep: boolean) => OnPickItemReturn;
  onClose: () => void;
}
export const PickerTemplate = <T extends PickerItemModel = PickerItemModel>({
  title,
  data,
  emptyText,
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
  onCancelFilter,
  onPickItem,
  onClose,
}: PickerTemplateProps<T>) => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const screenWatcher = useScreenWatcher();
  const inputRef = useRef<HTMLInputElement>(null);

  const [filterOn, setFilterOn] = useState(initialFilterOn);
  const [searchOn, setSearchOn] = useState(false);
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [chosenCode, setChosenCode] = useState(0);
  const [itemCounts, setItemCounts] = useState<Record<number, number>>({});
  const [hiddenCodes, setHiddenCodes] = useState(new Set<number>());

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

  const toggleFilter = (on?: boolean) => {
    if (filterToggleable) {
      const newFilterOn = on ?? !filterOn;
      setFilterOn(newFilterOn);

      if (!newFilterOn) onCancelFilter?.();
    }
  };

  const afterPickItem = (itemCode: number) => {
    if (isMultiSelect) {
      if (shouldHidePickedItem) {
        observedAreaRef.current
          ?.querySelector(`.${observedItemCls}[data-id="${itemCode}"]`)
          ?.setAttribute("hidden", "true");
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

  const searchInput = (
    <Input
      ref={inputRef}
      className="w-24 px-2 py-1 text-base leading-5 font-semibold shadow-common"
      placeholder="Search..."
      disabled={filterOn}
      onChange={(keyword) => {
        const lowerKw = keyword.toLowerCase();
        const newHiddenCodes = new Set<number>();

        if (lowerKw.length >= 2) {
          observedAreaRef.current?.querySelectorAll(`.${observedItemCls}`).forEach((elmt) => {
            if (elmt.hasAttribute("hidden") || !elmt.getAttribute("data-name")?.toLowerCase().includes(lowerKw)) {
              const code = elmt.getAttribute("data-id") ?? "";
              newHiddenCodes.add(+code);
            }
          });
        }
        setHiddenCodes(newHiddenCodes);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.currentTarget.value.length >= 2) {
          const firstVisibleItem = data.find((item) => !hiddenCodes.has(item.code));
          if (firstVisibleItem) onClickPickerItem(firstVisibleItem);
        }
      }}
    />
  );

  return (
    <div className="h-full flex flex-col rounded-lg shadow-white-glow">
      <Modal.CloseButton onClick={onClose} />

      <Modal.Header withDivider>
        <div className="flex items-center justify-between relative">
          <div>{title}</div>

          <div className="mr-6 pr-4 flex items-center">
            <div className="flex items-center gap-3">
              {hasSearch ? searchInput : null}
              {/* {hasSearch ? (
                <Button
                  className="shadow-common"
                  // variant={searchOn ? "neutral" : "default"}
                  variant={activeTool === "SEARCH" ? "neutral" : "default"}
                  shape="square"
                  size="small"
                  icon={<FaSearch />}
                  onClick={() => setActiveTool(activeTool === "SEARCH" ? "" : "SEARCH")}
                />
              ) : null} */}
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

      <div className="p-4 grow overflow-hidden relative">
        {/* <CollapseSpace active={searchOn}>
          <div className="pb-2 flex justify-center">{searchInput}</div>
        </CollapseSpace> */}

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
                    data-name={item.name}
                    className={clsx(
                      "grow-0 relative",
                      observedItemCls,
                      itemWidth,
                      item.vision ? "p-1.5 sm:pt-3 sm:pr-3 md1:p-2" : "p-1.5 sm:p-2",
                      hiddenCodes.has(item.code) && "hidden"
                    )}
                  >
                    <ItemCase chosen={item.code === chosenCode} onClick={() => onClickPickerItem(item)}>
                      <PickerItem
                        visible={visibleItems[item.code]}
                        item={item}
                        pickedAmount={itemCounts[item.code] || 0}
                      />
                    </ItemCase>
                  </div>
                );
              })}
            </div>

            {data.length ? null : (
              <div>
                <p>{emptyText}</p>
              </div>
            )}
          </div>

          {hasConfigStep ? <div className="overflow-auto shrink-0">{renderItemConfig?.(afterPickItem)}</div> : null}
        </div>

        <HorizontalScroll
          active={filterOn}
          activeWidth={screenWatcher.isFromSize("md1") ? filterWrapWidth : "100%"}
          closeOnMaskClick={filterToggleable}
          onClose={() => toggleFilter(false)}
        >
          {renderFilter?.(setFilterOn)}
        </HorizontalScroll>
      </div>
    </div>
  );
};
