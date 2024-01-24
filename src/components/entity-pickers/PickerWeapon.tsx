import { useMemo } from "react";

import type { WeaponType } from "@Src/types";
import { $AppData } from "@Src/services";

// Util
import { pickProps } from "@Src/utils";
import { createWeapon } from "@Src/utils/creators";

// Component
import { Modal } from "@Src/pure-components";
import { PickerTemplate, type OnPickItemReturn } from "../entity-pickers/PickerTemplate";

interface WeaponPickerProps {
  type?: string;
  weaponType: WeaponType;
  needMassAdd?: boolean;
  onPickWeapon: (info: ReturnType<typeof createWeapon>) => OnPickItemReturn;
  onClose: () => void;
}
function WeaponPicker({ weaponType, needMassAdd, onPickWeapon, onClose }: WeaponPickerProps) {
  const data = useMemo(() => {
    const weapons = $AppData.getAllWeapons(weaponType);
    return weapons.map((weapon) => pickProps(weapon, ["code", "name", "beta", "icon", "rarity"]));
  }, []);

  return (
    <PickerTemplate
      dataType="weapon"
      needMassAdd={needMassAdd}
      data={data}
      onPickItem={({ code }) => onPickWeapon(createWeapon({ type: weaponType, code }))}
      onClose={onClose}
    />
  );
}

export const PickerWeapon = Modal.wrap(WeaponPicker, { preset: "large" });
