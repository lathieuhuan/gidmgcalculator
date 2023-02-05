import clsx from "clsx";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import type { DataType, Filter, PickerItem } from "../types";

// Hook
import { useIntersectionObserver } from "@Src/hooks";

// Component
import { CollapseSpace, IconButton, Input } from "@Components/atoms";
import { ModalHeader } from "@Components/molecules";
import { CharacterFilter } from "../molecules/CharacterFilter";
import { MemoItem } from "../molecules/Item";

const { FilterButton, Text } = ModalHeader;

const DEFAULT_FILTER: Filter = { type: "", value: "" };

interface PickerProps {
  data: PickerItem[];
  dataType: DataType;
  needMassAdd?: boolean;
  onPickItem: (item: PickerItem) => void;
  onClose: () => void;
}
export const PickerTemplate = ({
  data,
  dataType,
  needMassAdd,
  onPickItem,
  onClose,
}: PickerProps) => {
  const [pickedNames, setPickedNames] = useState<Record<string, boolean>>({});

  const [filterOn, setFilterOn] = useState(false);
  const [filter, setFilter] = useState(DEFAULT_FILTER);
  const [keyword, setKeyword] = useState("");

  const [massAdd, setMassAdd] = useState(false);
  const [itemCounts, setItemCounts] = useState<number[]>([]);

  const { ref, observedItemCN, itemsVisible } = useIntersectionObserver<HTMLDivElement>();

  const visibleNames: Record<string, boolean> = {};

  if (dataType === "character") {
    for (const char of data) {
      if (!filter.type || char[filter.type] === filter.value) {
        visibleNames[char.name] = true;
      }
    }

    if (keyword) {
      for (const name in visibleNames) {
        if (!name.toLowerCase().includes(keyword)) {
          delete visibleNames[name];
        }
      }
    }

    if (Object.keys(pickedNames).length) {
      for (const name in visibleNames) {
        if (pickedNames[name]) {
          delete visibleNames[name];
        }
      }
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-2">
        <ModalHeader>
          <div className="pl-5 flex items-center">
            {dataType === "character" && (
              <>
                <FilterButton active={filterOn} onClick={() => setFilterOn(!filterOn)} />

                <Input
                  className="w-24 ml-3 px-2 py-1 leading-none font-semibold"
                  placeholder="Search..."
                  onChange={setKeyword}
                />

                <div className="absolute w-full top-full left-0 z-50">
                  <div className="rounded-b-lg bg-darkblue-3 shadow-common">
                    <CollapseSpace active={filterOn}>
                      <CharacterFilter
                        {...filter}
                        onClickOption={(isChosen, newFilter) => {
                          setFilter(isChosen ? DEFAULT_FILTER : newFilter);
                          setFilterOn(false);
                        }}
                      />
                    </CollapseSpace>
                  </div>
                </div>
              </>
            )}
          </div>

          <Text>{dataType}s</Text>

          <div className="flex justify-end items-center">
            {needMassAdd && (
              <label className="mr-4 flex font-bold text-black">
                <input
                  type="checkbox"
                  className="scale-150"
                  checked={massAdd}
                  onChange={() => setMassAdd((prev) => !prev)}
                />
                <span className="ml-2">Mass add</span>
              </label>
            )}

            <IconButton className="mr-2 text-black text-xl" variant="custom" onClick={onClose}>
              <FaTimes />
            </IconButton>
          </div>
        </ModalHeader>
      </div>

      <div className="px-4 pt-2 pb-4 flex-grow overflow-auto">
        <div ref={ref} className="pr-2 h-full custom-scrollbar">
          <div className="flex flex-wrap">
            {data.map((item, i) => {
              const count = itemCounts[i] || 0;

              return (
                <div
                  key={item.code.toString() + item.rarity}
                  data-id={item.code}
                  className={clsx(
                    observedItemCN,
                    "grow-0 max-w-1/3 basis-1/3 md1:max-w-1/5 md1:basis-1/5 md2:max-w-1/6 md2:basis-1/6 lg:max-w-1/8 lg:basis-[12.5%] relative",
                    item.vision ? "p-1.5 sm:pt-3 sm:pr-3 md1:p-2" : "p-1 sm:p-2",
                    { hidden: dataType === "character" && !visibleNames[item.name] }
                  )}
                >
                  <div
                    onClick={() => {
                      onPickItem(item);

                      if (!massAdd) {
                        onClose();
                      } //
                      else if (dataType !== "character") {
                        setItemCounts((prev) => {
                          const newItems = { ...prev };
                          newItems[i] = count + 1;
                          return newItems;
                        });
                      } else {
                        setPickedNames((prevPickedNames) => ({
                          ...prevPickedNames,
                          [item.name]: true,
                        }));
                      }
                    }}
                  >
                    <MemoItem
                      visible={itemsVisible[item.code]}
                      item={item}
                      itemType={dataType}
                      pickedAmount={count}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
