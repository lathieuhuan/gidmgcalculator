import clsx, { ClassValue } from "clsx";
import { useRaritySelect, useIconSelect } from "@Src/hooks";
import { ButtonGroup } from "@Src/pure-components";
import { Rarity, WeaponType } from "@Src/types";
import { ClearAllButton } from "./ClearAllButton";

export type WeaponFilterState = {
  types: WeaponType[];
  rarities: Rarity[];
};

export interface WeaponFilterProps {
  className?: ClassValue;
  initialFilter?: WeaponFilterState;
  forcedType?: WeaponType;
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
  const rarityOptions = [5, 4, 3, 2, 1];

  const { selectedTypes, updateTypes, renderTypeSelect } = useIconSelect.Weapon(initialFilter?.types, {
    multiple: true,
  });
  const { selectedRarities, updateRarities, renderRaritySelect } = useRaritySelect(
    rarityOptions,
    initialFilter?.rarities,
    { multiple: true }
  );

  const onConfirm = () => {
    onDone({
      types: forcedType ? [forcedType] : selectedTypes,
      rarities: selectedRarities,
    });
  };

  return (
    <div className={clsx("p-4 bg-dark-900 flex flex-col", className)}>
      <div className="grow space-y-4 hide-scrollbar">
        {forcedType ? null : (
          <>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p>Filter by Type</p>
                <ClearAllButton disabled={!selectedTypes.length} onClick={() => updateTypes([])} />
              </div>
              {renderTypeSelect("px-1")}
            </div>

            <div className="w-full h-px bg-dark-300" />
          </>
        )}

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p>Filter by Rarity</p>
            <ClearAllButton disabled={!selectedRarities.length} onClick={() => updateRarities([])} />
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
