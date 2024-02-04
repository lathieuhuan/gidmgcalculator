import clsx, { ClassValue } from "clsx";
import { useState } from "react";
import { useTypeFilter } from "@Src/hooks";
import { ButtonGroup, StarLine } from "@Src/pure-components";
import { ItemFilterState } from "./types";

const useRarityFilter = (options: number[], initialFilteredRarities: number[] = []) => {
  const [rarities, setRarities] = useState(initialFilteredRarities);

  const onToggleRarity = (rarity: number, checked: boolean) => {
    const newRarities = checked ? rarities.filter((r) => r !== rarity) : rarities.concat(rarity);

    if (newRarities.length) {
      setRarities(newRarities);
    }
  };

  const renderRarityFilter = (className?: ClassValue) => {
    return (
      <div className={clsx("flex flex-col space-y-2", className)}>
        {options.map((option) => {
          const selected = rarities.includes(option);

          return (
            <label key={option} className="p-2 rounded-sm border border-dark-300 flex justify-center">
              <input
                type="checkbox"
                className=""
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
    renderRarityFilter,
  };
};

export interface ItemFilterProps {
  className?: ClassValue;
  initialFilter?: ItemFilterState;
  forcedType?: string;
  onCancel: () => void;
  onDone: (filter: ItemFilterState) => void;
}
export const ItemFilter = ({ className, initialFilter, forcedType, onCancel, onDone }: ItemFilterProps) => {
  const { filteredTypes, renderTypeFilter } = useTypeFilter("weapon", initialFilter?.types);
  const { filteredRarities, renderRarityFilter } = useRarityFilter([5, 4, 3, 2, 1], initialFilter?.rarities);

  const onConfirm = () => {
    onDone({
      types: filteredTypes,
      rarities: filteredRarities,
    });
  };

  return (
    <div className={clsx("p-4 bg-dark-700 flex justify-center", className)}>
      <div className="flex flex-col">
        <p className="text-lg font-semibold">Filter</p>

        <div className="mt-3 grow flex flex-col md1:flex-row gap-6">
          <div className="space-y-3">
            <p className="text-sm">Rarity</p>
            {renderRarityFilter()}
          </div>

          <div className="space-y-3">
            <p className="text-sm">Type</p>
            {renderTypeFilter("justify-center")}
          </div>
        </div>

        <ButtonGroup.Confirm className="mt-4" justify="end" onCancel={onCancel} onConfirm={onConfirm} />
      </div>
    </div>
  );
};
