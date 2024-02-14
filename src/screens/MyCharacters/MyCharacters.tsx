import { useState } from "react";

import { useScreenWatcher } from "@Src/features";

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

type ModalType = "ADD_CHARACTER" | "SORT_CHARACTERS" | "";

export default function MyCharacters() {
  const dispatch = useDispatch();
  const screenWatcher = useScreenWatcher();
  const chosenChar = useSelector(selectChosenChar);
  const userChars = useSelector(selectUserChars);

  const [modalType, setModalType] = useState<ModalType>("");

  const closeModal = () => {
    setModalType("");
  };

  return (
    <div className="h-full flex flex-col bg-dark-500">
      {screenWatcher.isFromSize("md") ? (
        <CharacterList
          characters={userChars}
          chosenChar={chosenChar}
          onCliceSort={() => setModalType("SORT_CHARACTERS")}
          onClickWish={() => setModalType("ADD_CHARACTER")}
        />
      ) : (
        <div className="py-4 flex bg-dark-700">
          {userChars.length ? (
            <div className="w-full flex-center relative">
              <select
                className="styled-select py-0 text-1.5xl leading-base text-center text-last-center"
                value={chosenChar}
                onChange={(e) => dispatch(chooseCharacter(e.target.value))}
              >
                {userChars.map((userChar, i) => (
                  <option key={i}>{userChar.name}</option>
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
      )}

      <div className="grow flex-center overflow-y-auto">
        <div className="w-full h-98/100 flex justify-center">{userChars.length ? <CharacterInfo /> : null}</div>
      </div>

      <PickerCharacter
        active={modalType === "ADD_CHARACTER"}
        sourceType="app"
        hasMultipleMode
        filter={(character) => userChars.every((userChar) => userChar.name !== character.name)}
        onPickCharacter={(character) => {
          if (!userChars.length) {
            dispatch(chooseCharacter(character.name));
          }
          dispatch(addCharacter(character));
          return true;
        }}
        onClose={closeModal}
      />

      <CharacterSort active={modalType === "SORT_CHARACTERS"} onClose={closeModal} />
    </div>
  );
}
