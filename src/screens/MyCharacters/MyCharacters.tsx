import { useState } from "react";
import { createSelector } from "@reduxjs/toolkit";

// Store
import { addCharacter, chooseCharacter } from "@Store/userDatabaseSlice";
import { selectChosenChar, selectUserChars } from "@Store/userDatabaseSlice/selectors";
import { useDispatch, useSelector } from "@Store/hooks";

// Component
import { PickerCharacter } from "@Src/components";
import { Button } from "@Src/pure-components";
import CharacterSort from "./CharacterSort";
import CharacterList from "./CharacterList";
import CharacterInfo from "./CharacterInfo";

const selectCharacterNames = createSelector(selectUserChars, (userChars) => userChars.map(({ name }) => name));

type ModalType = "ADD_CHARACTER" | "SORT_CHARACTERS" | null;

export default function MyCharacters() {
  const dispatch = useDispatch();
  const chosenChar = useSelector(selectChosenChar);
  const characterNames = useSelector(selectCharacterNames);

  const [modalType, setModalType] = useState<ModalType>(null);

  return (
    <div className="h-full flex flex-col bg-dark-500">
      {window.innerWidth <= 700 ? (
        <div className="py-4 flex bg-dark-700">
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
        <CharacterList
          characterNames={characterNames}
          chosenChar={chosenChar}
          onCliceSort={() => setModalType("SORT_CHARACTERS")}
          onClickWish={() => setModalType("ADD_CHARACTER")}
        />
      )}

      <div className="grow flex-center overflow-y-auto">
        <div className="w-full h-98/100 flex justify-center">{!!characterNames.length && <CharacterInfo />}</div>
      </div>

      <PickerCharacter
        active={modalType === "ADD_CHARACTER"}
        sourceType="app"
        needMassAdd
        filter={({ name }) => !characterNames.includes(name)}
        onPickCharacter={async (character) => {
          if (!characterNames.length) {
            dispatch(chooseCharacter(character.name));
          }
          dispatch(addCharacter(character));
        }}
        onClose={() => setModalType(null)}
      />

      <CharacterSort active={modalType === "SORT_CHARACTERS"} onClose={() => setModalType(null)} />
    </div>
  );
}
