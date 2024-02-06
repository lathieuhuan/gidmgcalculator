import { Radio, StarLine } from "@Src/pure-components";
import clsx, { ClassValue } from "clsx";
import { useState } from "react";

export const useRarityFilter = (options: number[], initialFilteredRarities: number[] = []) => {
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

  const onCheckRadio = (rarity: number) => {
    setRarities([rarity]);
  };

  const renderRarityFilter = (className?: ClassValue) => {
    return (
      <div className={clsx("flex flex-col space-y-3", className)}>
        {options.map((option) => {
          const selected = rarities.includes(option);

          return (
            <div key={option} className="rounded-sm border border-dark-500 flex">
              <label className="grow p-2 flex justify-center border-r border-dark-500">
                <input
                  type="checkbox"
                  className="scale-110"
                  checked={selected}
                  onChange={() => onToggleRarity(option, selected)}
                />
                <StarLine className="ml-2 grow" rarity={option} />
              </label>

              <label className="px-2 flex-center shrink-0">
                <Radio
                  checked={rarities.length === 1 && rarities[0] === option}
                  onChange={() => onCheckRadio(option)}
                />
              </label>
            </div>
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
