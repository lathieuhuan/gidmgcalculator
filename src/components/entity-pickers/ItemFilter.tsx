import clsx, { ClassValue } from "clsx";
import { useState } from "react";

import { useTypeFilter } from "@Src/hooks";
import { ARTIFACT_TYPES, WEAPON_TYPES } from "@Src/constants";
import { Button, ButtonGroup, StarLine } from "@Src/pure-components";
import { ItemFilterState } from "./types";

const useRarityFilter = (options: number[], initialFilteredRarities: number[] = []) => {
  const [rarities, setRarities] = useState(initialFilteredRarities);

  const onToggleRarity = (rarity: number, checked: boolean) => {
    const newRarities = checked ? rarities.filter((r) => r !== rarity) : rarities.concat(rarity);

    if (newRarities.length) {
      setRarities(newRarities);
    }
  };

  const updateFilter = (rarities: number[]) => {
    setRarities(rarities);
  };

  const renderRarityFilter = (className?: ClassValue) => {
    return (
      <div className={clsx("flex flex-col space-y-2", className)}>
        {options.map((option) => {
          const selected = rarities.includes(option);

          return (
            <label key={option} className="p-2 rounded-sm border border-dark-500 flex justify-center">
              <input
                type="checkbox"
                className="scale-110"
                checked={selected}
                onChange={() => onToggleRarity(option, selected)}
              />
              <StarLine className="ml-2 grow" rarity={option} />
            </label>
          );
        })}
      </div>
    );
  };

  return {
    filteredRarities: rarities,
    allSelected: rarities.length === options.length,
    operate: {
      updateFilter,
    },
    renderRarityFilter,
  };
};

export interface ItemFilterProps {
  className?: ClassValue;
  itemType: "weapon" | "artifact";
  initialFilter?: ItemFilterState;
  forcedType?: string;
  onCancel: () => void;
  onDone: (filter: ItemFilterState) => void;
}
export const ItemFilter = ({ className, itemType, initialFilter, forcedType, onCancel, onDone }: ItemFilterProps) => {
  const rarityOptions = itemType === "weapon" ? [5, 4, 3, 2, 1] : [5, 4];

  const {
    filteredTypes,
    allSelected: allTypesSelected,
    operate: typeOperate,
    renderTypeFilter,
  } = useTypeFilter(itemType, initialFilter?.types, {
    requiredOne: true,
  });
  const {
    filteredRarities,
    allSelected: allRaritiesSelected,
    operate: rarityOperate,
    renderRarityFilter,
  } = useRarityFilter(rarityOptions, initialFilter?.rarities);

  const onClickSelectAllTypes = () => {
    typeOperate.updateFilter(itemType === "weapon" ? [...WEAPON_TYPES] : [...ARTIFACT_TYPES]);
  };

  const onClickSelectAllRarities = () => {
    rarityOperate.updateFilter(rarityOptions);
  };

  const onConfirm = () => {
    onDone({
      types: filteredTypes,
      rarities: filteredRarities,
    });
  };

  return (
    <div className={clsx("p-4 bg-dark-900 flex flex-col", className)}>
      <div className="grow flex flex-col hide-scrollbar">
        <p className="w-full text-lg font-semibold">Filter</p>

        <div className="mt-2 flex flex-col md1:flex-row gap-4">
          <div className="p-4 rounded bg-dark-700 space-y-6">
            <div className="flex justify-between items-center">
              <p>Type</p>
              <Button size="small" disabled={allTypesSelected} onClick={onClickSelectAllTypes}>
                Select all
              </Button>
            </div>
            {renderTypeFilter("justify-center")}
          </div>

          <div className="p-4 rounded bg-dark-700 space-y-6" style={{ minWidth: 240 }}>
            <div className="flex justify-between items-center">
              <p>Rarity</p>
              <Button size="small" disabled={allRaritiesSelected} onClick={onClickSelectAllRarities}>
                Select all
              </Button>
            </div>
            {renderRarityFilter()}
          </div>
        </div>
      </div>

      <ButtonGroup.Confirm className="mt-4" justify="end" focusConfirm onCancel={onCancel} onConfirm={onConfirm} />
    </div>
  );
};
