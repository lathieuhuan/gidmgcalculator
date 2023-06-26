import { useMemo } from "react";
import type { DataCharacter } from "@Src/types";
import type { ModalControl } from "@Src/components";
import type { PickerItem } from "./types";

// Data
import characters from "@Data/characters";

// Util
import { findByName, pickProps } from "@Src/utils";
import { findDataCharacter } from "@Data/controllers";

// Hook
import { useSelector } from "@Store/hooks";

// Component
import { Modal } from "@Src/components";
import { PickerTemplate } from "./PickerTemplate";

export interface CharacterPickerProps {
  sourceType: "mixed" | "appData" | "userData";
  needMassAdd?: boolean;
  filter?: (character: DataCharacter) => boolean;
  onPickCharacter: (character: PickerItem) => void;
  onClose: () => void;
}
const CharacterPicker = ({ sourceType, needMassAdd, filter, onPickCharacter, onClose }: CharacterPickerProps) => {
  const userChars = useSelector((state) => state.database.userChars);

  const data = useMemo(() => {
    const fields: Array<keyof DataCharacter> = ["code", "beta", "name", "icon", "rarity", "vision", "weaponType"];
    const data: PickerItem[] = [];

    if (sourceType === "mixed") {
      for (const character of Object.values(characters)) {
        const charData = pickProps(character, fields);
        const existedChar = findByName(userChars, character.name);

        if (existedChar) {
          data.push({ ...existedChar, ...charData });
        } else {
          data.push(charData);
        }
      }
    } else if (sourceType === "appData") {
      for (const character of Object.values(characters)) {
        if (!filter || filter(character)) {
          data.push(pickProps(character, fields));
        }
      }
    } else if (sourceType === "userData") {
      for (const { name, cons, artifactIDs } of userChars) {
        const found = findDataCharacter({ name });

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
      dataType="character"
      needMassAdd={needMassAdd}
      data={data}
      onPickItem={onPickCharacter}
      onClose={onClose}
    />
  );
};

export const PickerCharacter = ({ active, onClose, ...rest }: CharacterPickerProps & ModalControl) => {
  return (
    <Modal active={active} withDefaultStyle onClose={onClose}>
      <CharacterPicker {...rest} onClose={onClose} />
    </Modal>
  );
};
