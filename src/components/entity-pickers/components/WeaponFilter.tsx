import clsx, { ClassValue } from "clsx";
import { useRaritySelect, useIconSelect } from "@Src/hooks";
import { WEAPON_TYPES } from "@Src/constants";
import { Button, ButtonGroup } from "@Src/pure-components";
import { Rarity, WeaponType } from "@Src/types";

export type WeaponFilterState = {
  types: WeaponType[];
  rarities: Rarity[];
};

export interface WeaponFilterProps {
  className?: ClassValue;
  initialFilter?: WeaponFilterState;
  forcedType?: string;
  disabledCancel?: boolean;
  onCancel: () => void;
  onDone: (filter: WeaponFilterState) => void;
}
export const WeaponFilter = ({
  className,
  initialFilter,
  forcedType,
  disabledCancel,
  onCancel,
  onDone,
}: WeaponFilterProps) => {
  const selectConfig = {
    multiple: "withRadios",
    required: true,
  } as const;
  const rarityOptions = [5, 4, 3, 2, 1];

  const { selectedTypes, allTypesSelected, updateTypes, renderTypeSelect } = useIconSelect.Weapon(
    initialFilter?.types,
    selectConfig
  );
  const { selectedRarities, allRaritiesSelected, updateRarities, renderRaritySelect } = useRaritySelect(
    rarityOptions,
    initialFilter?.rarities,
    selectConfig
  );

  const onClickSelectAllTypes = () => {
    updateTypes([...WEAPON_TYPES]);
  };

  const onClickSelectAllRarities = () => {
    updateRarities(rarityOptions);
  };

  const onConfirm = () => {
    onDone({
      types: selectedTypes,
      rarities: selectedRarities,
    });
  };

  return (
    <div className={clsx("p-4 bg-dark-900 flex flex-col", className)}>
      <div className="grow space-y-4 hide-scrollbar">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p>Filter by Type</p>
            <Button size="small" disabled={allTypesSelected} onClick={onClickSelectAllTypes}>
              Select all
            </Button>
          </div>
          {renderTypeSelect("px-1")}
        </div>

        <div className="w-full h-px bg-dark-300" />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p>Filter by Rarity</p>
            <Button size="small" disabled={allRaritiesSelected} onClick={onClickSelectAllRarities}>
              Select all
            </Button>
          </div>
          {renderRaritySelect(undefined, { maxWidth: "14rem" })}
        </div>
      </div>

      <ButtonGroup.Confirm
        className="mt-4"
        justify="end"
        focusConfirm
        cancelButtonProps={{
          disabled: disabledCancel,
        }}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    </div>
  );
};
