import clsx, { ClassValue } from "clsx";

import { VISION_TYPES, WEAPON_TYPES } from "@Src/constants";
import { useIconSelect, useRaritySelect } from "@Src/hooks";
import { Rarity, Vision, WeaponType } from "@Src/types";
import { Button, ButtonGroup, VisionIcon } from "@Src/pure-components";

export type CharacterFilterState = {
  weaponTypes: WeaponType[];
  visionTypes: Vision[];
  rarities: Rarity[];
};

interface CharacterFilterProps {
  className?: ClassValue;
  initialFilter?: CharacterFilterState;
  onDone: (filter: CharacterFilterState) => void;
  onCancel: () => void;
}
export const CharacterFilter = ({ className, initialFilter, onCancel, onDone }: CharacterFilterProps) => {
  const VISION_ICONS = VISION_TYPES.map((type) => {
    return {
      type,
      icon: <VisionIcon type={type} />,
    };
  });
  const selectConfig = {
    multiple: "withRadios",
    required: true,
  } as const;

  const {
    allTypesSelected: allVisionSelected,
    selectedTypes: selectedVisions,
    updateTypes: updateVisions,
    renderTypeSelect: renderVisionSelect,
  } = useIconSelect(VISION_ICONS, initialFilter?.visionTypes, {
    ...selectConfig,
    iconCls: "text-2xl",
    selectedCls: "shadow-3px-3px shadow-blue-400",
  });

  const {
    allTypesSelected: allWeaponSelected,
    selectedTypes: selectedWeapons,
    updateTypes: updateWeapons,
    renderTypeSelect: renderWeaponSelect,
  } = useIconSelect.Weapon(initialFilter?.weaponTypes, selectConfig);

  const { selectedRarities, renderRaritySelect } = useRaritySelect([5, 4], initialFilter?.rarities, selectConfig);

  const onClickSelectAllVisions = () => {
    updateVisions([...VISION_TYPES]);
  };

  const onClickSelectAllWeapons = () => {
    updateWeapons([...WEAPON_TYPES]);
  };

  const onConfirm = () => {
    onDone({
      weaponTypes: selectedWeapons,
      visionTypes: selectedVisions,
      rarities: selectedRarities,
    });
  };

  return (
    <div className={clsx("px-3 py-4 bg-dark-900 flex flex-col", className)}>
      <div className="grow space-y-4 hide-scrollbar">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p>Filter by Vision</p>
            <Button size="small" disabled={allVisionSelected} onClick={onClickSelectAllVisions}>
              Select all
            </Button>
          </div>
          <div className="hide-scrollbar">{renderVisionSelect("px-1 pt-1 justify-center")}</div>
        </div>

        <div className="w-full h-px bg-dark-300" />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p>Filter by Weapon</p>
            <Button size="small" disabled={allWeaponSelected} onClick={onClickSelectAllWeapons}>
              Select all
            </Button>
          </div>
          {renderWeaponSelect("px-1")}
        </div>

        <div className="w-full h-px bg-dark-300" />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p>Filter by Rarity</p>
          </div>
          {renderRaritySelect(undefined, { maxWidth: "14rem" })}
        </div>
      </div>

      <ButtonGroup.Confirm className="mt-4" justify="end" focusConfirm onCancel={onCancel} onConfirm={onConfirm} />
    </div>
  );
};
