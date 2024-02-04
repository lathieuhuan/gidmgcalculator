import clsx from "clsx";
import { useMemo, useState } from "react";
import { FaFilter } from "react-icons/fa";

import type { AppWeapon, WeaponType } from "@Src/types";
import type { ItemFilterState, PickerItem } from "./types";
import { $AppData } from "@Src/services";

// Util
import { pickProps } from "@Src/utils";
import { createWeapon } from "@Src/utils/creators";

// Component
import { Button, Modal } from "@Src/pure-components";
import { PickerTemplate, type OnPickItemReturn } from "../entity-pickers/PickerTemplate";
import { ItemFilter, ItemFilterProps } from "./ItemFilter";

const initailFilter: ItemFilterState = {
  types: ["bow"],
  rarities: [4, 5],
};

interface WeaponPickerProps {
  type?: string;
  forcedType?: WeaponType;
  needMassAdd?: boolean;
  onPickWeapon: (info: ReturnType<typeof createWeapon>) => OnPickItemReturn;
  onClose: () => void;
}
function WeaponPicker({ forcedType, needMassAdd, onPickWeapon, onClose }: WeaponPickerProps) {
  const allWeapons = useMemo(() => {
    return $AppData
      .getAllWeapons()
      .map((weapon: AppWeapon) => pickProps(weapon, ["code", "name", "beta", "icon", "type", "rarity"]));
  }, []);

  const [filterOn, setFilterOn] = useState(!forcedType);
  const [filter, setFilter] = useState<ItemFilterState>();

  const filteredWeapons = useMemo(() => {
    if (!filter?.types?.length && !filter?.rarities?.length) {
      return [];
    }

    return allWeapons.filter((weapon) => filter.types.includes(weapon.type) && filter.rarities.includes(weapon.rarity));
  }, [filter]);

  const onClickFilter = () => {
    setFilterOn(!filterOn);
  };

  const onDoneFilter: ItemFilterProps["onDone"] = (newFilter) => {
    setFilter(newFilter);
    onClickFilter();
  };

  const onclickWeapon = (weapon: PickerItem) => {
    if (weapon.type) {
      onPickWeapon(createWeapon({ type: weapon.type, code: weapon.code }));
    }
  };

  return (
    <>
      <Modal.CloseButton onClick={onClose} />

      <Modal.Header withDivider>
        <div className="flex items-center relative">
          <Button
            className="mr-2 shadow-common"
            variant={filterOn ? "neutral" : "default"}
            shape="square"
            size="small"
            icon={<FaFilter />}
            onClick={onClickFilter}
          />
          <span>Weapons</span>
        </div>
      </Modal.Header>

      <div className="p-4 grow overflow-auto relative">
        <div className="h-full custom-scrollbar">
          <PickerTemplate
            data={filteredWeapons}
            onClickItem={onclickWeapon}
            // dataType="weapon"
            // needMassAdd={needMassAdd}
            // onClose={onClose}
          />
        </div>

        <div className={clsx("absolute full-stretch bg-black/60", filterOn ? "" : "hidden")} onClick={onClickFilter} />

        <div
          className={clsx(
            "absolute top-0 left-0 w-full md1:w-auto transition-size duration-300 overflow-hidden",
            filterOn ? "h-full" : "h-0"
          )}
        >
          <ItemFilter
            className="h-full"
            forcedType={forcedType}
            initialFilter={filter ?? initailFilter}
            onCancel={onClickFilter}
            onDone={onDoneFilter}
          />
        </div>
      </div>
    </>
  );
}

export const PickerWeapon = Modal.bareWrap(WeaponPicker, {
  preset: "large",
  className: "flex flex-col rounded-lg shadow-white-glow",
});
