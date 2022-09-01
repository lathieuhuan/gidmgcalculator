import type { Weapon } from "@Src/types";
import type { PickerItem } from "./types";

import characters from "@Data/characters";
import { findCharacter } from "@Data/controllers";
import { findByName } from "@Src/utils";
import { useSelector } from "@Store/hooks";
import { PickerTemplate } from "./PickerTemplate";

export interface PickerCharacterProps {
  sourceType: "mixed" | "appData" | "usersData";
  needMassAdd?: boolean;
  filter?: (character: { name: string; weapon: Weapon }) => boolean;
  onPickCharacter: (character: PickerItem) => void;
  onClose: () => void;
}
export function PickerCharacter({
  sourceType,
  needMassAdd,
  filter,
  onPickCharacter,
  onClose,
}: PickerCharacterProps) {
  const myChars = useSelector((state) => state.database.myChars);

  const data: PickerItem[] = [];

  if (sourceType === "mixed") {
    for (const { name, code, beta, icon, rarity, vision, weapon } of characters) {
      const char = { code, beta, icon, rarity, vision, weapon };
      const existedChar = findByName(myChars, name);

      if (existedChar) {
        data.push({ ...existedChar, ...char });
      } else {
        data.push({ name, ...char });
      }
    }
  } else if (sourceType === "appData") {
    for (const { code, beta, name, icon, rarity, vision, weapon } of characters) {
      if (filter === undefined || filter({ name, weapon })) {
        data.push({ code, beta, name, icon, rarity, vision, weapon });
      }
    }
  } else if (sourceType === "usersData") {
    for (const { name, cons, artifactIDs } of myChars) {
      const found = findCharacter({ name });

      if (found) {
        const { code, beta, icon, rarity, vision, weapon } = found;

        if (filter === undefined || filter({ name, weapon })) {
          data.push({ code, beta, name, icon, rarity, vision, weapon, cons, artifactIDs });
        }
      }
    }
  }

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
