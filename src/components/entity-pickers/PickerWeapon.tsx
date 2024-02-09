import { useMemo, useState } from "react";

import type { AppWeapon, Weapon } from "@Src/types";
import { $AppData } from "@Src/services";

// Util
import { pickProps } from "@Src/utils";
import { createWeapon } from "@Src/utils/creators";

// Component
import { Button, Modal } from "@Src/pure-components";
import { WeaponCard } from "../WeaponCard";
import { WeaponFilter, WeaponFilterProps, WeaponFilterState } from "./components/WeaponFilter";
import { OnPickItemReturn, PickerTemplate, PickerTemplateProps } from "./components/PickerTemplate";

const INITIAL_FITLER: WeaponFilterState = {
  types: ["bow"],
  rarities: [4, 5],
};

const getAllWeapons = () => {
  console.log("run");

  return $AppData.getAllWeapons((weapon) => pickProps(weapon, ["code", "name", "beta", "icon", "type", "rarity"]));
};

interface WeaponPickerProps extends Pick<PickerTemplateProps, "hasMultipleMode" | "hasConfigStep"> {
  forcedType?: WeaponFilterProps["forcedType"];
  onPickWeapon: (info: ReturnType<typeof createWeapon>) => OnPickItemReturn;
  onClose: () => void;
}
function WeaponPicker({ forcedType, onPickWeapon, onClose, ...templateProps }: WeaponPickerProps) {
  const allWeapons = useMemo(() => {
    const weapons = $AppData.getAllWeapons();
    const transformWeapon = (weapon: AppWeapon) =>
      pickProps(weapon, ["code", "name", "beta", "icon", "type", "rarity"]);

    if (forcedType) {
      return weapons.reduce<Array<ReturnType<typeof transformWeapon>>>((accumulator, weapon) => {
        if (weapon.type === forcedType) {
          accumulator.push(transformWeapon(weapon));
        }
        return accumulator;
      }, []);
    }

    return weapons.map(transformWeapon);
  }, []);

  const [ready, setReady] = useState(!!forcedType);
  const [weaponConfig, setWeaponConfig] = useState<Weapon>();
  const [hiddenCodes, setHiddenCodes] = useState(new Set(forcedType ? [] : allWeapons.map((weapon) => weapon.code)));

  const onConfirmFilter = (filter: WeaponFilterState) => {
    const newHiddenCodes = new Set<number>();

    allWeapons.forEach((weapon) => {
      if (!filter.types.includes(weapon.type) || !filter.rarities.includes(weapon.rarity)) {
        newHiddenCodes.add(weapon.code);
      }
    });
    setHiddenCodes(newHiddenCodes);

    if (!ready) setReady(true);
  };

  return (
    <PickerTemplate
      title="Weapons"
      data={allWeapons}
      hiddenCodes={hiddenCodes}
      emptyText="No weapons found"
      hasFilter
      initialFilterOn={!forcedType}
      filterToggleable={ready}
      filterWrapWidth={300}
      renderFilter={(setFilterOn) => {
        return (
          <WeaponFilter
            className="h-full"
            forcedType={forcedType}
            initialFilter={INITIAL_FITLER}
            disabledCancel={!ready}
            onCancel={() => setFilterOn(false)}
            onDone={(newFilter) => {
              onConfirmFilter(newFilter);
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
                  if (weaponConfig) setWeaponConfig({ ...weaponConfig, refi });
                }}
                upgrade={(level) => {
                  if (weaponConfig) setWeaponConfig({ ...weaponConfig, level });
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
