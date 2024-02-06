import { useMemo } from "react";
import type { AppCharacter, PartiallyRequired } from "@Src/types";
import type { PickerItem } from "./types";

import { $AppData } from "@Src/services";
import { useSelector } from "@Store/hooks";
import { findByName, pickProps } from "@Src/utils";

// Component
import { Modal } from "@Src/pure-components";
import { PickerTemplate, PickerTemplateProps, OnPickItemReturn } from "./PickerTemplate";

type PickedCharacter = PartiallyRequired<PickerItem, "weaponType" | "vision">;

export interface CharacterPickerProps {
  sourceType: "mixed" | "app" | "user";
  hasMultipleMode?: PickerTemplateProps["hasMultipleMode"];
  filter?: (character: AppCharacter) => boolean;
  onPickCharacter: (character: PickedCharacter) => OnPickItemReturn;
  onClose: () => void;
}
const CharacterPicker = ({ sourceType, hasMultipleMode, filter, onPickCharacter, onClose }: CharacterPickerProps) => {
  const userChars = useSelector((state) => state.database.userChars);

  // const inputRef = useRef<HTMLInputElement>(null);
  // const [pickedNames, setPickedNames] = useState<BooleanRecord>({});
  // const [keyword, setKeyword] = useState("");

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

  // const visibleNames: BooleanRecord = {};

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

  // const onPickItem = async (item: PickerItem, index: number) => {
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
  //       onPickItem(data[firstVisibleIndex], firstVisibleIndex);
  //     }
  //   }
  // };

  const data = useMemo(() => {
    const characters = $AppData.getAllCharacters();
    const fields: Array<keyof AppCharacter> = ["code", "beta", "name", "icon", "rarity", "vision", "weaponType"];
    const data: PickerItem[] = [];

    if (sourceType === "mixed") {
      for (const character of characters) {
        const charData = pickProps(character, fields);
        const existedChar = findByName(userChars, character.name);

        if (existedChar) {
          data.push({ ...existedChar, ...charData });
        } else {
          data.push(charData);
        }
      }
    } else if (sourceType === "app") {
      for (const character of Object.values(characters)) {
        if (!filter || filter(character)) {
          data.push(pickProps(character, fields));
        }
      }
    } else if (sourceType === "user") {
      for (const { name, cons, artifactIDs } of userChars) {
        const found = $AppData.getCharData(name);

        if (found) {
          if (!filter || filter(found)) {
            data.push({
              ...pickProps(found, fields),
              cons,
              artifactIDs,
            });
          }
        }
      }
    }

    return data;
  }, []);

  return (
    <PickerTemplate
      title="Characters"
      data={data}
      hasMultipleMode={hasMultipleMode}
      onPickItem={(character) => onPickCharacter(character as PickedCharacter)}
      onClose={onClose}
    />
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
  );
};

export const PickerCharacter = Modal.coreWrap(CharacterPicker, { preset: "large" });
