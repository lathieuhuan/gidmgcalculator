import clsx, { ClassValue } from "clsx";
import { useRaritySelect, useTypeSelect } from "@Src/hooks";
import { WEAPON_TYPES } from "@Src/constants";
import { Button, ButtonGroup } from "@Src/pure-components";
import { WeaponType } from "@Src/types";

export type WeaponFilterState = {
  types: WeaponType[];
  rarities: number[];
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

  const { selectedTypes, allTypesSelected, updateTypes, renderTypeSelect } = useTypeSelect.Weapon(
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
    <div className={clsx("p-4 pt-2 bg-dark-500 flex flex-col", className)}>
      <div className="grow flex flex-col hide-scrollbar">
        <p className="w-full text-lg font-semibold">Filter</p>

        <div className="mt-2 flex flex-col md1:flex-row gap-2">
          <div className="p-4 rounded bg-dark-900 space-y-6">
            <div className="flex justify-between items-center">
              <p>Type</p>
              <Button size="small" disabled={allTypesSelected} onClick={onClickSelectAllTypes}>
                Select all
              </Button>
            </div>
            {renderTypeSelect("justify-center")}
          </div>

          <div className="p-4 rounded bg-dark-900 space-y-6" style={{ minWidth: 240 }}>
            <div className="flex justify-between items-center">
              <p>Rarity</p>
              <Button size="small" disabled={allRaritiesSelected} onClick={onClickSelectAllRarities}>
                Select all
              </Button>
            </div>
            {renderRaritySelect()}
          </div>
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
