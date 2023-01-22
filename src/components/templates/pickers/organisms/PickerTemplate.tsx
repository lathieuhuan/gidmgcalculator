import clsx from "clsx";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import type { DataType, Filter, PickerItem } from "../types";

// Component
import { CollapseSpace, IconButton } from "@Components/atoms";
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
export function PickerTemplate({ data, dataType, needMassAdd, onPickItem, onClose }: PickerProps) {
  const [filterOn, setFilterOn] = useState(false);
  const [filter, setFilter] = useState(DEFAULT_FILTER);
  const [keyword, setKeyword] = useState("");

  const [massAdd, setMassAdd] = useState(false);
  const [amount, setAmount] = useState({
    total: 0,
    each: data.map(() => 0),
  });

  let filteredNames: string[] = [];

  if (dataType === "character") {
    for (const char of data) {
      if (!filter.type || char[filter.type] === filter.value) {
        filteredNames.push(char.name);
      }
    }

    if (keyword) {
      filteredNames = filteredNames.filter((name) => name.toLowerCase().startsWith(keyword));
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-2">
        <ModalHeader>
          <div className="pl-5 col-span-2 md2:col-span-1 flex items-center">
            {dataType === "character" && (
              <>
                <FilterButton active={filterOn} onClick={() => setFilterOn(!filterOn)} />

                <input
                  className="w-40 ml-3 px-2 py-1 leading-none font-semibold textinput-common"
                  placeholder="Search..."
                  onChange={(e) => setKeyword(e.target.value)}
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
              <label className="mr-4 flex items-center font-bold text-black">
                <input
                  type="checkbox"
                  className="scale-150"
                  checked={massAdd}
                  onChange={() => setMassAdd((prev) => !prev)}
                />
                <span className="ml-2">Mass Add ({amount.total})</span>
              </label>
            )}

            <IconButton className="mr-2 text-black text-xl" variant="custom" onClick={onClose}>
              <FaTimes />
            </IconButton>
          </div>
        </ModalHeader>
      </div>

      <div className="px-4 pt-2 pb-4 flex-grow overflow-auto">
        <div className="pr-2 h-full custom-scrollbar">
          <div className="flex flex-wrap">
            {data.map((item, i) => {
              return (
                <div
                  key={item.code.toString() + item.rarity}
                  className={clsx(
                    "grow-0 max-w-1/3 basis-1/3 md1:max-w-1/5 md1:basis-1/5 md2:max-w-1/6 md2:basis-1/6 lg:max-w-1/8 lg:basis-[12.5%]",
                    { hidden: dataType === "character" && !filteredNames.includes(item.name) }
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
