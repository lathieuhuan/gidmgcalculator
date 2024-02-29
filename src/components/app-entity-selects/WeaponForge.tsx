import { useMemo, useRef, useState } from "react";

import type { AppWeapon, Weapon, WeaponType } from "@Src/types";
import { $AppData } from "@Src/services";

// Util
import { pickProps } from "@Src/utils";
import { createWeapon } from "@Src/utils/creators";

// Component
import { Modal } from "@Src/pure-components";
import { WeaponCard } from "../WeaponCard";
import { WeaponFilter, WeaponFilterState } from "./components/WeaponFilter";
import { AppEntitySelect, AppEntitySelectProps } from "./components/AppEntitySelect";

const transformWeapon = (weapon: AppWeapon) => pickProps(weapon, ["code", "name", "beta", "icon", "type", "rarity"]);

type WeaponData = Array<ReturnType<typeof transformWeapon>>;

interface WeaponForgeProps extends Pick<AppEntitySelectProps, "hasMultipleMode" | "hasConfigStep"> {
  forcedType?: WeaponType;
  onForgeWeapon: (info: ReturnType<typeof createWeapon>) => void;
  onClose: () => void;
}
function WeaponSmith({ forcedType, onForgeWeapon, onClose, ...templateProps }: WeaponForgeProps) {
  const filterRef = useRef<WeaponFilterState>(
    forcedType
      ? {
          types: [forcedType],
          rarities: [],
        }
      : {
          types: ["bow"],
          rarities: [4, 5],
        }
  );

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
    filterRef.current = filter;

    if (!ready) setReady(true);
  };

  return (
    <AppEntitySelect
      title="Weapon Forge"
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
            withTypeSelect={!forcedType}
            initialFilter={filterRef.current}
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
          <WeaponCard
            wrapperCls="w-76 h-full"
            mutable
            weapon={weaponConfig}
            refine={(refi, config) => {
              setWeaponConfig({ ...config, refi });
            }}
            upgrade={(level, config) => {
              setWeaponConfig({ ...config, level });
            }}
            actions={[
              {
                text: "Forge",
                variant: "positive",
                onClick: (_, config) => {
                  onForgeWeapon(config);
                  afterSelect(config.code);
                },
              },
            ]}
          />
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
