import clsx, { ClassValue } from "clsx";
import { useState } from "react";
import { Radio, StarLine } from "@Src/pure-components";

type Config = {
  multiple?: boolean;
  required?: boolean;
  withRadios?: boolean;
  onChange?: (selectedRarities: number[]) => void;
};

export const useRaritySelect = (options: number[], initialValues?: number[] | null, config?: Config) => {
  const [selectedRarities, setSelectedRarities] = useState(initialValues ?? []);
  const { multiple, required, withRadios, onChange } = config || {};

  const updateRarities = (newRarities: number[]) => {
    setSelectedRarities(newRarities);
    onChange?.(newRarities);
  };

  const onClickStarline = (value: number, currentSelected: boolean) => {
    if (multiple) {
      const newRarities = currentSelected
        ? selectedRarities.filter((rarity) => rarity !== value)
        : selectedRarities.concat(value);

      if (!required || newRarities.length) {
        updateRarities(newRarities);
      }
    } else {
      updateRarities([value]);
    }
  };

  const onCheckRadio = (rarity: number) => {
    updateRarities([rarity]);
  };

  const renderRaritySelect = (className?: ClassValue) => {
    return (
      <div className={clsx("flex flex-col space-y-3", className)}>
        {options.map((option) => {
          const selected = selectedRarities.includes(option);

          return (
            <div key={option} className="rounded-sm border border-dark-500 flex">
              <label className={clsx("grow p-2 flex justify-center", withRadios && "border-r border-dark-500")}>
                <input
                  type="checkbox"
                  className="scale-110"
                  checked={selected}
                  onChange={() => onClickStarline(option, selected)}
                />
                <StarLine className="ml-2 grow" rarity={option} />
              </label>

              {withRadios ? (
                <label className="px-2 flex-center shrink-0">
                  <Radio
                    checked={selectedRarities.length === 1 && selectedRarities[0] === option}
                    onChange={() => onCheckRadio(option)}
                  />
                </label>
              ) : null}
            </div>
          );
        })}
      </div>
    );
  };

  return {
    selectedRarities,
    allRaritiesSelected: selectedRarities.length === options.length,
    updateRarities,
    renderRaritySelect,
  };
};
