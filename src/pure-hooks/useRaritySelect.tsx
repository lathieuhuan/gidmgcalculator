import clsx, { ClassValue } from "clsx";
import { CSSProperties, useState } from "react";
import { Checkbox, RarityStars } from "@Src/pure-components";

type Config = {
  multiple?: boolean;
  // required?: boolean;
  onChange?: (rarities: number[]) => void;
};

export const useRaritySelect = (options: number[], initialValues?: number[] | null, config?: Config) => {
  const [rarities, setRarities] = useState(initialValues ?? []);
  const { multiple, onChange } = config || {};
  // const withRadios = multiple === "withRadios";

  const updateRarities = (newRarities: number[]) => {
    setRarities(newRarities);
    onChange?.(newRarities);
  };

  const onClickStarline = (value: number, currentSelected: boolean) => {
    const newRarities = multiple
      ? currentSelected
        ? rarities.filter((rarity) => rarity !== value)
        : rarities.concat(value)
      : [value];

    updateRarities(newRarities);
  };

  // const onCheckRadio = (rarity: number) => {
  //   updateRarities([rarity]);
  // };

  const renderRaritySelect = (className?: ClassValue, style?: CSSProperties) => {
    return (
      <div className={clsx("flex flex-col space-y-3", className)} style={style}>
        {options.map((option) => {
          const selected = rarities.includes(option);

          return (
            <div key={option} className="rounded-sm border border-dark-500 flex">
              <label
                // className={clsx("grow p-2 flex items-center cursor-pointer", withRadios && "border-r border-dark-500")}
                className="grow p-2 flex items-center cursor-pointer"
              >
                <Checkbox size="small" checked={selected} onChange={() => onClickStarline(option, selected)} />
                <RarityStars className="ml-2 grow" rarity={option} />
              </label>

              {/* {withRadios ? (
                <label className="px-2 flex-center shrink-0 cursor-pointer">
                  <Radio
                    checked={rarities.length === 1 && rarities[0] === option}
                    onChange={() => onCheckRadio(option)}
                  />
                </label>
              ) : null} */}
            </div>
          );
        })}
      </div>
    );
  };

  return {
    rarities,
    // allRaritiesSelected: rarities.length === options.length,
    updateRarities,
    renderRaritySelect,
  };
};
