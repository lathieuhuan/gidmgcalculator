import { useMemo, useState } from "react";
import type { AppCharacter, UserCharacter } from "@Src/types";

import { $AppData } from "@Src/services";
import { useStoreSnapshot } from "@Src/features";
import { findByName, pickProps } from "@Src/utils";

// Component
import { Modal } from "@Src/pure-components";
import { PickerTemplate, PickerTemplateProps, OnPickItemReturn } from "./components/PickerTemplate";
import { CharacterFilter, CharacterFilterState } from "./components/CharacterFilter";

type PickedCharacterKey = "code" | "beta" | "name" | "icon" | "rarity" | "vision" | "weaponType";

type PickedCharacter = Pick<AppCharacter, PickedCharacterKey> & Partial<Pick<UserCharacter, "cons" | "artifactIDs">>;

export interface CharacterPickerProps extends Pick<PickerTemplateProps, "hasMultipleMode" | "hasConfigStep"> {
  sourceType: "app" | "user" | "mixed";
  initialFilter?: CharacterFilterState;
  filter?: (character: PickedCharacter) => boolean;
  onPickCharacter: (character: PickedCharacter) => OnPickItemReturn;
  onClose: () => void;
}
const CharacterPicker = ({
  sourceType,
  filter: filterFn,
  initialFilter,
  onPickCharacter,
  onClose,
  ...templateProps
}: CharacterPickerProps) => {
  const userChars = useStoreSnapshot((state) => state.database.userChars);

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
          const characterData = $AppData.getCharacter(userChar.name);

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

    return filterFn ? processedCharacters.filter(filterFn) : processedCharacters;
  }, []);

  const [hiddenCodes, setHiddenCodes] = useState(new Set<number>());

  const onConfirmFilter = (filter: CharacterFilterState) => {
    const newHiddenCodes = new Set<number>();
    const elementFiltered = filter.elementTypes.length !== 0;
    const weaponFiltered = filter.weaponTypes.length !== 0;
    const rarityFiltered = filter.rarities.length !== 0;

    allCharacters.forEach((character) => {
      if (
        (elementFiltered && !filter.elementTypes.includes(character.vision)) ||
        (weaponFiltered && !filter.weaponTypes.includes(character.weaponType)) ||
        (rarityFiltered && !filter.rarities.includes(character.rarity))
      ) {
        newHiddenCodes.add(character.code);
      }
    });
    setHiddenCodes(newHiddenCodes);
  };

  return (
    <PickerTemplate
      title="Characters"
      data={allCharacters}
      hiddenCodes={hiddenCodes}
      emptyText="No characters found"
      hasSearch
      hasFilter
      shouldHidePickedItem={templateProps.hasMultipleMode}
      renderFilter={(setFilterOn) => {
        return (
          <CharacterFilter
            className="h-full"
            initialFilter={initialFilter}
            onCancel={() => setFilterOn(false)}
            onDone={(filter) => {
              onConfirmFilter(filter);
              setFilterOn(false);
            }}
          />
        );
      }}
      onPickItem={(character) => onPickCharacter(character as PickedCharacter)}
      onClose={onClose}
      {...templateProps}
    />
  );
};

export const PickerCharacter = Modal.coreWrap(CharacterPicker, { preset: "large" });
