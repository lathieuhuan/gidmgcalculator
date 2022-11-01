import classNames from "classnames";
import { useState } from "react";
import type { DataType, Filter, PickerItem } from "./types";

import { CollapseSpace } from "@Components/collapse";
import { ModalHeader } from "@Src/styled-components";
import CharFilter from "./CharFilter";
import MemoItem from "./Item";

const { FilterButton, CloseButton, Text } = ModalHeader;

const DEFAULT_FILTER: Filter = { type: "", value: "" };

interface PickerProps {
  data: PickerItem[];
  dataType: DataType;
  needMassAdd?: boolean;
  onPickItem: (item: PickerItem) => void;
  onClose: () => void;
}
export function PickerTemplate({ data, dataType, needMassAdd, onPickItem, onClose }: PickerProps) {
  const [filterOn, setFilterOn] = useState(false);
  const [filter, setFilter] = useState(DEFAULT_FILTER);
  const [massAdd, setMassAdd] = useState(false);
  const [amount, setAmount] = useState({
    total: 0,
    each: data.map(() => 0),
  });

  let filteredNames: string[] = [];
  if (dataType === "character" && filter.type) {
    for (const char of data) {
      if (char[filter.type] === filter.value) {
        filteredNames.push(char.name);
      }
    }
  }
  return (
    <div className="h-full flex flex-col">
      <div className="p-2">
        <ModalHeader>
          {dataType === "character" && (
            <>
              <FilterButton active={filterOn} onClick={() => setFilterOn(!filterOn)} />
              <div className="absolute w-full top-full left-0 z-50">
                <div className="rounded-b-lg bg-darkblue-3 shadow-common">
                  <CollapseSpace active={filterOn}>
                    <CharFilter
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

          <Text>{dataType}s</Text>

          {needMassAdd && (
            <div className="absolute right-16 flex items-center">
              <label className="flex font-bold text-black">
                <input
                  type="checkbox"
                  className="scale-150"
                  checked={massAdd}
                  onChange={() => setMassAdd((prev) => !prev)}
                />
                <span className="ml-2 pt-1">Mass Add ({amount.total})</span>
              </label>
            </div>
          )}

          <CloseButton onClick={onClose} />
        </ModalHeader>
      </div>

      <div className="px-4 pt-2 pb-4 flex-grow overflow-auto">
        <div className="pr-4 h-full custom-scrollbar">
          <div className="flex flex-wrap">
            {data.map((item, i) => {
              return (
                <div
                  key={item.code.toString() + item.rarity}
                  className={classNames(
                    "grow-0 max-w-1/3 basis-1/3 md1:max-w-1/5 md1:basis-1/5 md2:max-w-1/6 md2:basis-1/6 lg:max-w-1/8 lg:basis-[12.5%]",
                    { hidden: filter.type && !filteredNames.includes(item.name) }
                  )}
                >
                  <MemoItem
                    item={item}
                    massAdd={massAdd}
                    pickedAmount={amount.each[i]}
                    onClickItem={() => {
                      onPickItem(item);
                      if (!massAdd) {
                        onClose();
                      } else {
                        setAmount((prev) => {
                          const each = [...prev.each];
                          if (dataType !== "character") {
                            each[i] += 1;
                          }
                          return { total: prev.total + 1, each };
                        });
                      }
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
