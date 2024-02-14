import clsx, { ClassValue } from "clsx";
import { useWeaponTypeSelect } from "@Src/hooks";
import { useRaritySelect } from "@Src/pure-hooks";
import { Rarity, WeaponType } from "@Src/types";

// Component
import { ButtonGroup } from "@Src/pure-components";
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
  const { weaponTypes, updateWeaponTypes, renderWeaponTypeSelect } = useWeaponTypeSelect(initialFilter?.types, {
    multiple: true,
  });
  const { rarities, updateRarities, renderRaritySelect } = useRaritySelect([5, 4, 3, 2, 1], initialFilter?.rarities, {
    multiple: true,
  });

  const onConfirm = () => {
    onDone({
      types: forcedType ? [forcedType] : weaponTypes,
      rarities,
    });
  };

  return (
    <div className={clsx("p-4 bg-dark-900 flex flex-col", className)}>
      <div className="grow space-y-4 hide-scrollbar">
        {forcedType ? null : (
          <>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="whitespace-nowrap">Filter by Type</p>
                <ClearAllButton disabled={!weaponTypes.length} onClick={() => updateWeaponTypes([])} />
              </div>
              {renderWeaponTypeSelect("px-1")}
            </div>

            <div className="w-full h-px bg-dark-300" />
          </>
        )}

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="whitespace-nowrap">Filter by Rarity</p>
            <ClearAllButton disabled={!rarities.length} onClick={() => updateRarities([])} />
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
