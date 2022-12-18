import { useRef, useState } from "react";
import { createSelector } from "@reduxjs/toolkit";

// Action
import { addCharacter, chooseCharacter } from "@Store/userDatabaseSlice";

// Selector
import { selectChosenChar, selectMyChars } from "@Store/userDatabaseSlice/selectors";

// Hook
import { useDispatch, useSelector } from "@Store/hooks";

// Component
import { Button } from "@Components/atoms";
import { Picker } from "@Components/Picker";
import CharacterSort from "./CharacterSort";
import SideIconCarousel from "./SideIconCarousel";
import Info from "./Info";

const selectCharacterNames = createSelector(selectMyChars, (myChars) =>
  myChars.map(({ name }) => name)
);

type ModalType = "ADD_CHARACTER" | "SORT_CHARACTERS" | null;

export default function MyCharacters() {
  const [modalType, setModalType] = useState<ModalType>(null);

  const chosenChar = useSelector(selectChosenChar);
  const characterNames = useSelector(selectCharacterNames);

  const characterListRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

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
              <Button
                className="ml-6"
                variant="positive"
                onClick={() => setModalType("ADD_CHARACTER")}
              >
                Add
              </Button>
            </div>
          ) : (
            <Button
              className="mx-auto"
              variant="positive"
              onClick={() => setModalType("ADD_CHARACTER")}
            >
              Add New Characters
            </Button>
          )}
        </div>
      ) : (
        <SideIconCarousel
          characterNames={characterNames}
          characterListRef={characterListRef}
          onCliceSort={() => setModalType("SORT_CHARACTERS")}
          onClickWish={() => setModalType("ADD_CHARACTER")}
        />
      )}
      <div className="grow flex-center overflow-y-auto">
        <div className="w-full h-98/100 flex justify-center">
          {!!characterNames.length && <Info />}
        </div>
      </div>

      <Picker.Character
        active={modalType === "ADD_CHARACTER"}
        sourceType="appData"
        needMassAdd
        filter={({ name }) => !characterNames.includes(name)}
        onPickCharacter={({ name, weaponType }) => {
          if (weaponType) {
            dispatch(addCharacter({ name, weaponType }));
          }
          if (characterListRef.current) characterListRef.current.scrollLeft = 0;
        }}
        onClose={() => setModalType(null)}
      />

      <CharacterSort active={modalType === "SORT_CHARACTERS"} onClose={() => setModalType(null)} />
    </div>
  );
}
