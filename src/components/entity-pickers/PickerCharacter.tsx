import { memo, useMemo } from "react";
import type { AppCharacter, UserCharacter } from "@Src/types";

import { $AppData } from "@Src/services";
import { useStoreSnapshot } from "@Src/features";
import { findByName, pickProps } from "@Src/utils";

// Component
import { Modal } from "@Src/pure-components";
import { PickerTemplate, PickerTemplateProps, OnPickItemReturn } from "./components/PickerTemplate";

type PickedCharacterKey = "code" | "beta" | "name" | "icon" | "rarity" | "vision" | "weaponType";

type PickedCharacter = Pick<AppCharacter, PickedCharacterKey> & Partial<Pick<UserCharacter, "cons" | "artifactIDs">>;

export interface CharacterPickerProps extends Pick<PickerTemplateProps, "hasMultipleMode" | "hasConfigStep"> {
  sourceType: "app" | "user" | "mixed";
  filter?: (character: PickedCharacter) => boolean;
  onPickCharacter: (character: PickedCharacter) => OnPickItemReturn;
  onClose: () => void;
}
const CharacterPicker = ({ sourceType, filter, onPickCharacter, onClose, ...templateProps }: CharacterPickerProps) => {
  const userChars = useStoreSnapshot((state) => state.database.userChars);

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

  const allCharacters = useMemo(() => {
    const pickedKey: PickedCharacterKey[] = ["code", "beta", "name", "icon", "rarity", "vision", "weaponType"];
    const processedCharacters: PickedCharacter[] = [];

    switch (sourceType) {
      case "app":
        for (const characterData of $AppData.getAllCharacters()) {
          processedCharacters.push(pickProps(characterData, pickedKey));
        }
        break;
      case "user":
        for (const userChar of userChars) {
          const characterData = $AppData.getCharData(userChar.name);

          if (characterData) {
            const character = Object.assign(pickProps(characterData, pickedKey), {
              cons: userChar.cons,
              artifactIDs: userChar.artifactIDs,
            });
            processedCharacters.push(character);
          }
        }
        break;
      case "mixed":
        for (const characterData of $AppData.getAllCharacters()) {
          const character = pickProps(characterData, pickedKey);
          const userCharacter = findByName(userChars, character.name);

          processedCharacters.push(Object.assign(character, userCharacter));
        }
        break;
    }

    return processedCharacters;
  }, []);

  const filteredCharacters = useMemo(() => {
    if (filter) {
      return allCharacters.filter(filter);
    }

    return allCharacters;
  }, [allCharacters]);

  console.log(filteredCharacters);

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

  // const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
  //   if (e.key === "Enter" && keyword) {
  //     const firstVisibleIndex = data.findIndex((item) => visibleNames[item.name]);

  //     if (firstVisibleIndex !== -1) {
  //       onPickItem(data[firstVisibleIndex], firstVisibleIndex);
  //     }
  //   }
  // };

  return (
    <PickerTemplate
      title="Characters"
      data={filteredCharacters}
      shouldHidePickedItem={templateProps.hasMultipleMode}
      onPickItem={(character) => onPickCharacter(character as PickedCharacter)}
      onClose={onClose}
      {...templateProps}
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

export const PickerCharacter = Modal.coreWrap(
  memo(CharacterPicker, () => true),
  { preset: "large" }
);
