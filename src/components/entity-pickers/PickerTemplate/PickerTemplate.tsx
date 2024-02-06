import clsx from "clsx";
import { useState, ReactNode } from "react";

import type { Filter, PickedItem } from "../types";
import { useIntersectionObserver } from "@Src/pure-hooks";

// Component
import { Modal, Button, CollapseAndMount } from "@Src/pure-components";
import { CharacterFilter } from "./CharacterFilter";
import { MemoPickerItemView } from "./Item";
import { FaFilter } from "react-icons/fa";

/** this pick is valid or not */
type Return = boolean;

export type OnPickItemReturn = Return | Promise<Return>;

export interface PickerTemplateProps<T extends PickedItem = PickedItem> {
  title: string;
  data: T[];
  hasMultipleMode?: boolean;
  hasConfigStep?: boolean;
  /** Default to true */
  hasFilter?: boolean;
  /** Default to true */
  filterToggleable?: boolean;
  initialFilterOn?: boolean;
  renderFilter?: (setFilterOn: (on: boolean) => void) => ReactNode;
  renderItemConfig?: (afterPickItem: (code: number) => void) => ReactNode;
  onPickItem?: (item: T, isConfigStep: boolean) => OnPickItemReturn;
  onClose: () => void;
}
export const PickerTemplate = <T extends PickedItem = PickedItem>({
  title,
  data,
  hasMultipleMode,
  hasConfigStep,
  hasFilter = true,
  filterToggleable = true,
  initialFilterOn = false,
  renderFilter,
  renderItemConfig,
  onPickItem,
  onClose,
}: PickerTemplateProps<T>) => {
  const [filterOn, setFilterOn] = useState(initialFilterOn);
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [itemCounts, setItemCounts] = useState<Record<number, number>>({});

  const { observedAreaRef, observedItemCls, visibleItems } = useIntersectionObserver<HTMLDivElement>();

  const toggleFilter = () => {
    if (filterToggleable) setFilterOn(!filterOn);
  };

  const afterPickItem = (itemCode: number) => {
    if (isMultiSelect) {
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
        <div className="pr-8 flex items-center justify-between relative">
          <div className="flex items-center">
            {hasFilter ? (
              <Button
                className="mr-2 shadow-common"
                variant={filterOn ? "neutral" : "default"}
                shape="square"
                size="small"
                icon={<FaFilter />}
                disabled={!filterToggleable}
                onClick={toggleFilter}
              />
            ) : null}
            <span>{title}</span>
          </div>

          {hasMultipleMode ? (
            <label className="h-6 flex items-center">
              <input type="checkbox" className="mr-2 scale-110" onChange={(e) => setIsMultiSelect(e.target.checked)} />
              <span className="text-base text-light-400">Multiple</span>
            </label>
          ) : null}
        </div>
      </Modal.Header>

      <div className="p-4 grow overflow-auto relative">
        <div className="h-full flex custom-scrollbar gap-4">
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
                    <div onClick={() => onClickPickerItem(item)}>
                      <MemoPickerItemView
                        visible={visibleItems[item.code]}
                        item={item}
                        pickedAmount={itemCounts[item.code] || 0}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {hasConfigStep ? (
            <div className="w-75 overflow-auto shrink-0">{renderItemConfig?.(afterPickItem)}</div>
          ) : null}
        </div>

        <div
          className={clsx("absolute full-stretch z-10 bg-black/60 hidden", filterOn && "md1:block")}
          onClick={toggleFilter}
        />

        <CollapseAndMount
          active={filterOn}
          className="absolute top-0 left-0 z-10 w-full md1:w-auto"
          activeHeight="100%"
          moveDuration={300}
        >
          {renderFilter?.(setFilterOn)}
        </CollapseAndMount>
      </div>
    </div>
  );
};
