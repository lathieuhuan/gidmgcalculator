import { Picker } from "@Components/Picker";
import characters from "@Data/characters";
import { createSelector } from "@reduxjs/toolkit";
import { Button, Select } from "@Src/styled-components";
import { useDispatch, useSelector } from "@Store/hooks";
import { addCharacter, chooseCharacter } from "@Store/usersDatabaseSlice";
import { selectChosenChar, selectMyChars } from "@Store/usersDatabaseSlice/selectors";
import { RefObject, useRef, useState } from "react";
import CharacterSort from "./CharacterSort";
import SideIconCarousel from "./SideIconCarousel";
import Info from "./Info";

const selectCharacterNames = createSelector(selectMyChars, (myChars) =>
  myChars.map(({ name }) => name)
);

type ModalType = "addCharacterPicker" | "sortingCharacter" | null;

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
              <Select
                className="px-2 py-1 text-black rounded bg-white text-2xl leading-base text-center text-last-center font-bold"
                value={chosenChar}
                onChange={(e) => dispatch(chooseCharacter(e.target.value))}
              >
                {characterNames.map((name, i) => (
                  <option key={i}>{name}</option>
                ))}
              </Select>
              <Button
                className="ml-6"
                variant="positive"
                onClick={() => setModalType("addCharacterPicker")}
              >
                Add
              </Button>
            </div>
          ) : (
            <Button
              className="mx-auto"
              variant="positive"
              onClick={() => setModalType("addCharacterPicker")}
            >
              Add New Characters
            </Button>
          )}
        </div>
      ) : (
        <SideIconCarousel
          characterNames={characterNames}
          characterListRef={characterListRef}
          onCliceSort={() => setModalType("sortingCharacter")}
          onClickWish={() => setModalType("addCharacterPicker")}
        />
      )}
      <div className="grow flex-center overflow-y-auto">
        <div className="w-full h-98/100 flex justify-center">
          {!!characterNames.length && <Info />}
        </div>
      </div>

      {modalType === "addCharacterPicker" && (
        <CharacterPicker
          characterNames={characterNames}
          characterListRef={characterListRef}
          onClose={() => setModalType(null)}
        />
      )}

      {modalType === "sortingCharacter" && <CharacterSort onClose={() => setModalType(null)} />}
    </div>
  );
}

interface CharacterPickerProps {
  characterListRef: RefObject<HTMLDivElement>;
  characterNames: string[];
  onClose: () => void;
}
function CharacterPicker({ characterListRef, characterNames, onClose }: CharacterPickerProps) {
  const dispatch = useDispatch();

  const wishlist = [];
  for (const databaseChar of characters) {
    if (!characterNames.includes(databaseChar.name)) {
      const { name, code, beta, icon, rarity, vision, weapon } = databaseChar;
      wishlist.push({ name, code, beta, icon, rarity, vision, weapon });
    }
  }
  return (
    <Picker
      needMassAdd={true}
      data={wishlist}
      dataType="character"
      onPickItem={({ name, weapon }) => {
        if (weapon) {
          dispatch(addCharacter({ name, weapon }));
        }
        if (characterListRef.current) characterListRef.current.scrollLeft = 0;
      }}
      onClose={onClose}
    />
  );
}
