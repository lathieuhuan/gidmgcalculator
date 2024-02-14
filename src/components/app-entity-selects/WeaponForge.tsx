import { useMemo, useState } from "react";

import type { AppWeapon, Weapon } from "@Src/types";
import { $AppData } from "@Src/services";

// Util
import { pickProps } from "@Src/utils";
import { createWeapon } from "@Src/utils/creators";

// Component
import { Button, Modal } from "@Src/pure-components";
import { WeaponCard } from "../WeaponCard";
import { WeaponFilter, WeaponFilterProps, WeaponFilterState } from "./app-entity-selects-components/WeaponFilter";
import { AppEntitySelect, AppEntitySelectProps } from "./app-entity-selects-components/AppEntitySelect";

const INITIAL_FITLER: WeaponFilterState = {
  types: ["bow"],
  rarities: [4, 5],
};

const transformWeapon = (weapon: AppWeapon) => pickProps(weapon, ["code", "name", "beta", "icon", "type", "rarity"]);

type WeaponData = Array<ReturnType<typeof transformWeapon>>;

interface WeaponForgeProps extends Pick<AppEntitySelectProps, "hasMultipleMode" | "hasConfigStep"> {
  forcedType?: WeaponFilterProps["forcedType"];
  onForgeWeapon: (info: ReturnType<typeof createWeapon>) => void;
  onClose: () => void;
}
function WeaponSmith({ forcedType, onForgeWeapon, onClose, ...templateProps }: WeaponForgeProps) {
  const allWeapons = useMemo(() => {
    const weapons = $AppData.getAllWeapons();

    if (forcedType) {
      return weapons.reduce<WeaponData>((accumulator, weapon) => {
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
    const typeFiltered = filter.types.length !== 0;
    const rarityFiltered = filter.rarities.length !== 0;

    allWeapons.forEach((weapon) => {
      if (
        (typeFiltered && !filter.types.includes(weapon.type)) ||
        (rarityFiltered && !filter.rarities.includes(weapon.rarity))
      ) {
        newHiddenCodes.add(weapon.code);
      }
    });
    setHiddenCodes(newHiddenCodes);

    if (!ready) setReady(true);
  };

  return (
    <AppEntitySelect
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
      renderOptionConfig={(afterSelect) => {
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
                      onForgeWeapon(weaponConfig);
                      afterSelect(weaponConfig.code);
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
      onSelect={(mold, isConfigStep) => {
        const weapon = createWeapon(mold);

        if (isConfigStep) {
          setWeaponConfig({
            ID: 0,
            ...weapon,
          });
        } else {
          onForgeWeapon(weapon);
        }

        return true;
      }}
      onClose={onClose}
      {...templateProps}
    />
  );
}

export const WeaponForge = Modal.coreWrap(WeaponSmith, { preset: "large" });
