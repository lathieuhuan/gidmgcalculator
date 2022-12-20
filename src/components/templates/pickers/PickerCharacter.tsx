import { useMemo } from "react";
import type { DataCharacter } from "@Src/types";
import type { PickerItem } from "./types";

// Data
import characters from "@Data/characters";

// Util
import { findByName, pickProps } from "@Src/utils";
import { findCharacter } from "@Data/controllers";

// Hook
import { useSelector } from "@Store/hooks";

// Component
import { Modal, type ModalControl } from "@Components/molecules";
import { PickerTemplate } from "./organisms/PickerTemplate";

export interface PickerCharacterCoreProps {
  sourceType: "mixed" | "appData" | "userData";
  needMassAdd?: boolean;
  filter?: (character: DataCharacter) => boolean;
  onPickCharacter: (character: PickerItem) => void;
  onClose: () => void;
}
function PickerCharacterCore({
  sourceType,
  needMassAdd,
  filter,
  onPickCharacter,
  onClose,
}: PickerCharacterCoreProps) {
  const myChars = useSelector((state) => state.database.myChars);

  const data = useMemo(() => {
    const fields: Array<keyof DataCharacter> = [
      "code",
      "beta",
      "name",
      "icon",
      "rarity",
      "vision",
      "weaponType",
    ];
    const data: PickerItem[] = [];

    if (sourceType === "mixed") {
      for (const character of characters) {
        const charData = pickProps(character, fields);
        const existedChar = findByName(myChars, character.name);

        if (existedChar) {
          data.push({ ...existedChar, ...charData });
        } else {
          data.push(charData);
        }
      }
    } else if (sourceType === "appData") {
      for (const character of characters) {
        if (!filter || filter(character)) {
          data.push(pickProps(character, fields));
        }
      }
    } else if (sourceType === "userData") {
      for (const { name, cons, artifactIDs } of myChars) {
        const found = findCharacter({ name });

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
}

export const PickerCharacter = ({
  active,
  onClose,
  ...rest
}: PickerCharacterCoreProps & ModalControl) => {
  return (
    <Modal active={active} withDefaultStyle onClose={onClose}>
      <PickerCharacterCore {...rest} onClose={onClose} />
    </Modal>
  );
};
