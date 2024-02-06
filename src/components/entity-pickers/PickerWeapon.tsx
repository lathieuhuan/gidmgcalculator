import { useMemo, useState } from "react";

import type { Weapon, WeaponType } from "@Src/types";
import type { ItemFilterState } from "./types";
import { $AppData } from "@Src/services";

// Util
import { pickProps } from "@Src/utils";
import { createWeapon } from "@Src/utils/creators";

// Component
import { Button, Modal } from "@Src/pure-components";
import { WeaponCard } from "../WeaponCard";
import { PickerTemplate, PickerTemplateProps, OnPickItemReturn } from "./PickerTemplate";
import { WeaponFilter, WeaponFilterProps } from "./components/WeaponFilter";

const INITIAL_FITLER_STATE: ItemFilterState = {
  types: ["bow"],
  rarities: [4, 5],
};

interface WeaponPickerProps extends Pick<PickerTemplateProps, "hasMultipleMode" | "hasConfigStep"> {
  forcedType?: WeaponFilterProps["forcedType"];
  onPickWeapon: (info: ReturnType<typeof createWeapon>) => OnPickItemReturn;
  onClose: () => void;
}
function WeaponPicker({ forcedType, onPickWeapon, onClose, ...templateProps }: WeaponPickerProps) {
  const [filter, setFilter] = useState<ItemFilterState>();
  const [weaponConfig, setWeaponConfig] = useState<Weapon>();

  const allWeapons = useMemo(() => {
    return $AppData
      .getAllWeapons()
      .map((weapon) => pickProps(weapon, ["code", "name", "beta", "icon", "type", "rarity"]));
  }, []);

  const filteredWeapons = useMemo(() => {
    if (!filter?.types?.length && !filter?.rarities?.length) {
      return [];
    }
    return allWeapons.filter((weapon) => filter.types.includes(weapon.type) && filter.rarities.includes(weapon.rarity));
  }, [filter]);

  return (
    <PickerTemplate
      title="Weapons"
      data={filteredWeapons}
      hasFilter
      initialFilterOn={!forcedType}
      filterToggleable={filter !== undefined}
      renderFilter={(setFilterOn) => {
        return (
          <WeaponFilter
            className="h-full"
            forcedType={forcedType}
            initialFilter={filter ?? INITIAL_FITLER_STATE}
            disabledCancel={!filter}
            onCancel={() => setFilterOn(false)}
            onDone={(newFilter) => {
              setFilter(newFilter);
              setFilterOn(false);
            }}
          />
        );
      }}
      renderItemConfig={(afterPickItem) => {
        return (
          <div className="h-full p-4 bg-dark-900 rounded-lg flex flex-col">
            <div className="w-70 grow hide-scrollbar">
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
      onPickItem={(mold, isConfigStep) => {
        const weapon = createWeapon(mold);

        if (isConfigStep) {
          setWeaponConfig({
            ID: 0,
            ...weapon,
          });
          return true;
        }

        return onPickWeapon(weapon);
      }}
      onClose={onClose}
      {...templateProps}
    />
  );
}

export const PickerWeapon = Modal.coreWrap(WeaponPicker, { preset: "large" });
