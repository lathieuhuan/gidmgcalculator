import { useRef, useState } from "react";
import { createSelector } from "@reduxjs/toolkit";

// Action
import { addCharacter, chooseCharacter } from "@Store/userDatabaseSlice";

// Selector
import { selectChosenChar, selectUserChars } from "@Store/userDatabaseSlice/selectors";

// Hook
import { useDispatch, useSelector } from "@Store/hooks";

// Component
import { PickerCharacter } from "@Src/features";
import { Button } from "@Components/atoms";
import CharacterSort from "./CharacterSort";
import SideIconCarousel from "./SideIconCarousel";
import Info from "./Info";

const selectCharacterNames = createSelector(selectUserChars, (userChars) => userChars.map(({ name }) => name));

type ModalType = "ADD_CHARACTER" | "SORT_CHARACTERS" | null;

export default function MyCharacters() {
  const dispatch = useDispatch();

  const chosenChar = useSelector(selectChosenChar);
  const characterNames = useSelector(selectCharacterNames);

  const [modalType, setModalType] = useState<ModalType>(null);

  return (
    <div className="h-full flex flex-col bg-darkblue-3">
      {window.innerWidth <= 700 ? (
        <div className="py-4 flex bg-darkblue-2">
          {characterNames.length ? (
            <div className="w-full flex-center relative">
              <select
                className="styled-select py-0 text-1.5xl leading-base text-center text-last-center"
                value={chosenChar}
                onChange={(e) => dispatch(chooseCharacter(e.target.value))}
              >
                {characterNames.map((name, i) => (
                  <option key={i}>{name}</option>
                ))}
              </select>
              <Button className="ml-6" variant="positive" onClick={() => setModalType("ADD_CHARACTER")}>
                Add
              </Button>
            </div>
          ) : (
            <Button className="mx-auto" variant="positive" onClick={() => setModalType("ADD_CHARACTER")}>
              Add new characters
            </Button>
          )}
        </div>
      ) : (
        <SideIconCarousel
          characterNames={characterNames}
          chosenChar={chosenChar}
          onCliceSort={() => setModalType("SORT_CHARACTERS")}
          onClickWish={() => setModalType("ADD_CHARACTER")}
        />
      )}
      <div className="grow flex-center overflow-y-auto">
        <div className="w-full h-98/100 flex justify-center">{!!characterNames.length && <Info />}</div>
      </div>

      <PickerCharacter
        active={modalType === "ADD_CHARACTER"}
        sourceType="appData"
        needMassAdd
        filter={({ name }) => !characterNames.includes(name)}
        onPickCharacter={({ name, weaponType }) => {
          if (weaponType) {
            dispatch(addCharacter({ name, weaponType }));
          }
        }}
        onClose={() => setModalType(null)}
      />

      <CharacterSort active={modalType === "SORT_CHARACTERS"} onClose={() => setModalType(null)} />
    </div>
  );
}
