import { useMemo, useState } from "react";

import type { Weapon, WeaponType } from "@Src/types";
import type { ItemFilterState } from "./types";
import { $AppData } from "@Src/services";

// Util
import { pickProps } from "@Src/utils";
import { createWeapon } from "@Src/utils/creators";

// Component
import { Button, Modal } from "@Src/pure-components";
import { PickerTemplate, PickerTemplateProps, OnPickItemReturn } from "./PickerTemplate";
import { ItemFilter, ItemFilterProps } from "./ItemFilter";
import { WeaponCard } from "../WeaponCard";

const initialFilter: ItemFilterState = {
  types: ["bow"],
  rarities: [4, 5],
};

interface WeaponPickerProps extends Pick<PickerTemplateProps, "hasMultipleMode" | "hasConfigStep"> {
  forcedType?: ItemFilterProps["forcedType"];
  onPickWeapon: (info: ReturnType<typeof createWeapon>) => OnPickItemReturn;
  onClose: () => void;
}
function WeaponPicker({ forcedType, onPickWeapon, onClose, ...templateProps }: WeaponPickerProps) {
  const allWeapons = useMemo(() => {
    return $AppData
      .getAllWeapons()
      .map((weapon) => pickProps(weapon, ["code", "name", "beta", "icon", "type", "rarity"]));
  }, []);

  const [filter, setFilter] = useState<ItemFilterState>();
  const [weaponConfig, setWeaponConfig] = useState<Weapon>();

  const filteredWeapons = useMemo(() => {
    if (!filter?.types?.length && !filter?.rarities?.length) {
      return [];
    }
    return allWeapons.filter((weapon) => filter.types.includes(weapon.type) && filter.rarities.includes(weapon.rarity));
  }, [filter]);

  const onPickItem: PickerTemplateProps["onPickItem"] = (weapon, isConfigStep) => {
    if (weapon.type) {
      const newWeapon = createWeapon({
        type: weapon.type as WeaponType,
        code: weapon.code,
      });

      if (isConfigStep) {
        return setWeaponConfig({
          ID: 0,
          ...newWeapon,
        });
      }

      return onPickWeapon(newWeapon);
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
      renderItemConfig={(afterPickItem) => {
        return (
          <div className="h-full flex flex-col">
            <div className="grow hide-scrollbar">
              <WeaponCard
                mutable
                weapon={weaponConfig}
                refine={(refi) => {
                  if (weaponConfig) {
                    setWeaponConfig({ ...weaponConfig, refi });
                  }
                }}
                upgrade={(level) => {
                  if (weaponConfig) {
                    setWeaponConfig({ ...weaponConfig, level });
                  }
                }}
              />
            </div>

            {weaponConfig ? (
              <div className="mt-4 flex justify-center">
                <Button
                  variant="positive"
                  onClick={() => {
                    if (weaponConfig) {
                      onPickWeapon(weaponConfig);
                      afterPickItem(weaponConfig.code);
                    }
                  }}
                >
                  Select
                </Button>
              </div>
            ) : null}
          </div>
        );
      }}
      onClose={onClose}
      onPickItem={onPickItem}
      {...templateProps}
    />
  );
}

export const PickerWeapon = Modal.bareWrap(WeaponPicker, { preset: "large" });
