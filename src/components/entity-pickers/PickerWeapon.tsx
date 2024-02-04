import { useMemo, useState } from "react";

import type { WeaponType } from "@Src/types";
import type { ItemFilterState, PickerItem } from "./types";
import { $AppData } from "@Src/services";

// Util
import { pickProps } from "@Src/utils";
import { createWeapon } from "@Src/utils/creators";

// Component
import { Modal } from "@Src/pure-components";
import { PickerTemplate, type OnPickItemReturn } from "../entity-pickers/PickerTemplate";
import { ItemFilter } from "./ItemFilter";

const initialFilter: ItemFilterState = {
  types: ["bow"],
  rarities: [4, 5],
};

interface WeaponPickerProps {
  forcedType?: WeaponType;
  canMultiple?: boolean;
  onPickWeapon: (info: ReturnType<typeof createWeapon>) => OnPickItemReturn;
  onClose: () => void;
}
function WeaponPicker({ forcedType, canMultiple, onPickWeapon, onClose }: WeaponPickerProps) {
  const allWeapons = useMemo(() => {
    return $AppData
      .getAllWeapons()
      .map((weapon) => pickProps(weapon, ["code", "name", "beta", "icon", "type", "rarity"]));
  }, []);

  const [filter, setFilter] = useState<ItemFilterState>();

  const filteredWeapons = useMemo(() => {
    if (!filter?.types?.length && !filter?.rarities?.length) {
      return [];
    }
    return allWeapons.filter((weapon) => filter.types.includes(weapon.type) && filter.rarities.includes(weapon.rarity));
  }, [filter]);

  const onclickWeapon = async (weapon: PickerItem) => {
    if (weapon.type) {
      const newWeapon = createWeapon({
        type: weapon.type as WeaponType,
        code: weapon.code,
      });
      const result = await onPickWeapon(newWeapon);
      const { isValid = true } = result || {};

      if (isValid) {
        onClose();
      }
    }
  };

  return (
    <PickerTemplate
      title="Weapons"
      data={filteredWeapons}
      initialFilterOn={!forcedType}
      renderFilter={(toggle) => {
        return (
          <ItemFilter
            className="h-full"
            itemType="weapon"
            forcedType={forcedType}
            initialFilter={filter ?? initialFilter}
            onCancel={toggle}
            onDone={(newFilter) => {
              setFilter(newFilter);
              toggle();
            }}
          />
        );
      }}
      onClose={onClose}
      onClickItem={onclickWeapon}
    />
  );
}

export const PickerWeapon = Modal.bareWrap(WeaponPicker, {
  preset: "large",
  className: "flex flex-col rounded-lg shadow-white-glow",
});
