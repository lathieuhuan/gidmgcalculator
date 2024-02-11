import clsx, { ClassValue } from "clsx";

import { ELEMENT_TYPES } from "@Src/constants";
import { useIconSelect, useRaritySelect } from "@Src/hooks";
import { Rarity, ElementType, WeaponType } from "@Src/types";
import { ElementIcon } from "@Src/components";
import { ButtonGroup } from "@Src/pure-components";
import { ClearAllButton } from "./ClearAllButton";

export type CharacterFilterState = {
  weaponTypes: WeaponType[];
  elementTypes: ElementType[];
  rarities: Rarity[];
};

interface CharacterFilterProps {
  className?: ClassValue;
  initialFilter?: CharacterFilterState;
  onDone: (filter: CharacterFilterState) => void;
  onCancel: () => void;
}
export const CharacterFilter = ({ className, initialFilter, onCancel, onDone }: CharacterFilterProps) => {
  const ELEMENT_ICONS = ELEMENT_TYPES.map((type) => {
    return {
      type,
      icon: <ElementIcon type={type} />,
    };
  });

  const {
    selectedTypes: selectedElements,
    updateTypes: updateElements,
    renderTypeSelect: renderElementSelect,
  } = useIconSelect(ELEMENT_ICONS, initialFilter?.elementTypes, {
    multiple: true,
    iconCls: "text-2xl",
    selectedCls: "shadow-3px-3px shadow-blue-400",
  });

  const {
    selectedTypes: selectedWeapons,
    updateTypes: updateWeapons,
    renderTypeSelect: renderWeaponSelect,
  } = useIconSelect.Weapon(initialFilter?.weaponTypes, { multiple: true });

  const { selectedRarities, renderRaritySelect } = useRaritySelect([5, 4], initialFilter?.rarities, { multiple: true });

  const onConfirm = () => {
    onDone({
      weaponTypes: selectedWeapons,
      elementTypes: selectedElements,
      rarities: selectedRarities,
    });
  };

  return (
    <div className={clsx("px-3 py-4 bg-dark-900 flex flex-col", className)}>
      <div className="grow space-y-4 hide-scrollbar">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="whitespace-nowrap">Filter by Element</p>
            <ClearAllButton disabled={!selectedElements.length} onClick={() => updateElements([])} />
          </div>
          <div className="hide-scrollbar">{renderElementSelect("p-1 justify-center")}</div>
        </div>

        <div className="w-full h-px bg-dark-300" />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="whitespace-nowrap">Filter by Weapon</p>
            <ClearAllButton disabled={!selectedWeapons.length} onClick={() => updateWeapons([])} />
          </div>
          {renderWeaponSelect("px-1")}
        </div>

        <div className="w-full h-px bg-dark-300" />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="whitespace-nowrap">Filter by Rarity</p>
          </div>
          {renderRaritySelect(undefined, { maxWidth: "14rem" })}
        </div>
      </div>

      <ButtonGroup.Confirm className="mt-4" justify="end" focusConfirm onCancel={onCancel} onConfirm={onConfirm} />
    </div>
  );
};
