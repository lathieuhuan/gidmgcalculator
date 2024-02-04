import clsx from "clsx";
import { KeyboardEventHandler, useEffect, useRef, useState } from "react";

import type { BooleanRecord } from "@Src/types";
import type { DataType, Filter, PickerItem } from "../types";
import { useIntersectionObserver } from "@Src/pure-hooks";

// Component
import { Input, CollapseSpace, ModalHeader } from "@Src/pure-components";
import { CharacterFilter } from "./CharacterFilter";
import { MemoPickerItemView } from "./Item";

const DEFAULT_FILTER: Filter = { type: "", value: "" };

type Return = void | {
  /** default to true */
  isValid: boolean;
};

export type OnPickItemReturn = Return | Promise<Return>;

export interface PickerTemplateProps {
  data: PickerItem[];
  // dataType: DataType;
  // needMassAdd?: boolean;
  // onPickItem: (item: PickerItem) => OnPickItemReturn;
  onClickItem?: (item: PickerItem) => void;
  // onClose: () => void;
}
export const PickerTemplate = ({ data }: PickerTemplateProps) => {
  // const inputRef = useRef<HTMLInputElement>(null);
  // const [pickedNames, setPickedNames] = useState<BooleanRecord>({});

  // const [filterOn, setFilterOn] = useState(false);
  // const [filter, setFilter] = useState(DEFAULT_FILTER);
  // const [keyword, setKeyword] = useState("");

  // const [massAdd, setMassAdd] = useState(false);
  // const [itemCounts, setItemCounts] = useState<number[]>([]);

  const { observedAreaRef, observedItemCls, visibleItems } = useIntersectionObserver<HTMLDivElement>();

  // useEffect(() => {
  //   const focus = (e: KeyboardEvent) => {
  //     if (e.key.length === 1 && dataType === "character" && document.activeElement !== inputRef.current) {
  //       inputRef.current?.focus();
  //     }
  //   };
  //   document.body.addEventListener("keydown", focus);

  //   return () => {
  //     document.body.removeEventListener("keydown", focus);
  //   };
  // }, [dataType]);

  const visibleNames: BooleanRecord = {};

  // if (dataType === "character") {
  //   for (const char of data) {
  //     if (!filter.type || char[filter.type] === filter.value) {
  //       visibleNames[char.name] = true;
  //     }
  //   }
  //   if (keyword) {
  //     const lowerKw = keyword.toLowerCase();

  //     for (const name in visibleNames) {
  //       if (!name.toLowerCase().includes(lowerKw)) {
  //         delete visibleNames[name];
  //       }
  //     }
  //   }
  //   if (Object.keys(pickedNames).length) {
  //     for (const name in visibleNames) {
  //       if (pickedNames[name]) {
  //         delete visibleNames[name];
  //       }
  //     }
  //   }
  // }

  // const onClickItem = async (item: PickerItem, index: number) => {
  //   const { isValid = true } = (await onPickItem(item)) || {};

  //   if (isValid) {
  //     if (!massAdd) {
  //       onClose();
  //     } //
  //     else if (dataType === "character") {
  //       setPickedNames((prevPickedNames) => ({
  //         ...prevPickedNames,
  //         [item.name]: true,
  //       }));
  //     } //
  //     else {
  //       setItemCounts((prev) => {
  //         const newItems = { ...prev };
  //         newItems[index] = (newItems[index] || 0) + 1;
  //         return newItems;
  //       });
  //     }
  //   }
  // };

  // const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
  //   if (e.key === "Enter" && keyword) {
  //     const firstVisibleIndex = data.findIndex((item) => visibleNames[item.name]);

  //     if (firstVisibleIndex !== -1) {
  //       onClickItem(data[firstVisibleIndex], firstVisibleIndex);
  //     }
  //   }
  // };

  return (
    <div ref={observedAreaRef} className="sm:pr-2 h-full custom-scrollbar">
      <div className="flex flex-wrap">
        {data.map((item, i) => {
          return (
            <div
              key={`${item.code}-${item.rarity}`}
              data-id={item.code}
              className={clsx(
                observedItemCls,
                "grow-0 max-w-1/3 basis-1/3 md1:max-w-1/5 md1:basis-1/5 md2:max-w-1/6 md2:basis-1/6 lg:max-w-1/8 lg:basis-[12.5%] relative",
                item.vision ? "p-1.5 sm:pt-3 sm:pr-3 md1:p-2" : "p-1 sm:p-2"
                // { hidden: dataType === "character" && !visibleNames[item.name] }
              )}
            >
              <div
                onClick={() => {
                  // onClickItem(item, i);
                }}
              >
                <MemoPickerItemView
                  visible={visibleItems[item.code]}
                  item={item}
                  // pickedAmount={itemCounts[i] || 0}
                  pickedAmount={0}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>

    // <div className="h-full flex flex-col">
    //   <div className="p-2">
    //     <ModalHeader>
    //       {dataType === "character" ? (
    //         <div className="pl-5 flex items-center">
    //           <ModalHeader.FilterButton active={filterOn} onClick={() => setFilterOn(!filterOn)} />

    //           <Input
    //             ref={inputRef}
    //             className="w-24 ml-3 px-2 py-1 leading-5 font-semibold shadow-common"
    //             placeholder="Search..."
    //             onChange={setKeyword}
    //             onKeyDown={onKeyDown}
    //           />

    //           <div className="absolute w-full top-full left-0 z-50">
    //             <div className="rounded-b-lg bg-dark-500 shadow-common">
    //               <CollapseSpace active={filterOn}>
    //                 <CharacterFilter
    //                   {...filter}
    //                   onClickOption={(isChosen, newFilter) => {
    //                     setFilter(isChosen ? DEFAULT_FILTER : newFilter);
    //                     setFilterOn(false);
    //                   }}
    //                 />
    //               </CollapseSpace>
    //             </div>
    //           </div>
    //         </div>
    //       ) : (
    //         <div />
    //       )}

    //       <ModalHeader.Text>{dataType}s</ModalHeader.Text>
    //       <ModalHeader.RightEnd
    //         extraContent={
    //           needMassAdd && (
    //             <label className="mr-4 flex font-bold text-black">
    //               <input
    //                 type="checkbox"
    //                 className="scale-150"
    //                 checked={massAdd}
    //                 onChange={() => setMassAdd((prev) => !prev)}
    //               />
    //               <span className="ml-2">Mass add</span>
    //             </label>
    //           )
    //         }
    //         onClickClose={onClose}
    //       />
    //     </ModalHeader>
    //   </div>

    //   <div className="px-4 pt-2 pb-4 flex-grow overflow-auto">
    //     <div ref={observedAreaRef} className="pr-2 h-full custom-scrollbar">
    //       <div className="flex flex-wrap">
    //         {data.map((item, i) => {
    //           return (
    //             <div
    //               key={`${item.code}-${item.rarity}`}
    //               data-id={item.code}
    //               className={clsx(
    //                 observedItemCls,
    //                 "grow-0 max-w-1/3 basis-1/3 md1:max-w-1/5 md1:basis-1/5 md2:max-w-1/6 md2:basis-1/6 lg:max-w-1/8 lg:basis-[12.5%] relative",
    //                 item.vision ? "p-1.5 sm:pt-3 sm:pr-3 md1:p-2" : "p-1 sm:p-2",
    //                 { hidden: dataType === "character" && !visibleNames[item.name] }
    //               )}
    //             >
    //               <div onClick={() => onClickItem(item, i)}>
    //                 <MemoPickerItemView
    //                   visible={visibleItems[item.code]}
    //                   item={item}
    //                   itemType={dataType}
    //                   pickedAmount={itemCounts[i] || 0}
    //                 />
    //               </div>
    //             </div>
    //           );
    //         })}
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};
