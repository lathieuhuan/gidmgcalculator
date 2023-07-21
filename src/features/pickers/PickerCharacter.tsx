import { useMemo } from "react";
import type { AppCharacter, PartiallyRequired } from "@Src/types";
import type { PickerItem } from "./types";

import { appData } from "@Data/index";
import characters from "@Data/characters";
import { useSelector } from "@Store/hooks";
import { findByName, pickProps } from "@Src/utils";

// Component
import { withModal } from "@Src/pure-components";
import { PickerTemplate } from "./PickerTemplate";

type PickedCharacter = PartiallyRequired<PickerItem, "weaponType" | "vision">;

export interface CharacterPickerProps {
  sourceType: "mixed" | "app" | "user";
  needMassAdd?: boolean;
  filter?: (character: AppCharacter) => boolean;
  onPickCharacter: (character: PickedCharacter) => void;
  onClose: () => void;
}
const CharacterPicker = ({ sourceType, needMassAdd, filter, onPickCharacter, onClose }: CharacterPickerProps) => {
  const userChars = useSelector((state) => state.database.userChars);

  const data = useMemo(() => {
    const fields: Array<keyof AppCharacter> = ["code", "beta", "name", "icon", "rarity", "vision", "weaponType"];
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
    } else if (sourceType === "app") {
      for (const character of Object.values(characters)) {
        if (!filter || filter(character)) {
          data.push(pickProps(character, fields));
        }
      }
    } else if (sourceType === "user") {
      for (const { name, cons, artifactIDs } of userChars) {
        const found = appData.getCharData(name);

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
      onPickItem={(character) => onPickCharacter(character as PickedCharacter)}
      onClose={onClose}
    />
  );
};

export const PickerCharacter = withModal(CharacterPicker, { withDefaultStyle: true });
