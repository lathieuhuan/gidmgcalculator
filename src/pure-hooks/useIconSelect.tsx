import clsx, { ClassValue } from "clsx";
import { useState } from "react";

import { toArray } from "@Src/utils";
import { Image, Radio } from "@Src/pure-components";

type IconOption<T> = {
  type: T;
  icon: string | JSX.Element;
};

type SelectSize = "medium" | "large";

export type IconSelectInitialValues<T> = T | T[] | null;

export type IconSelectConfig<T> = {
  size?: SelectSize;
  iconCls?: ClassValue;
  selectedCls?: ClassValue;
  multiple?: boolean | "withRadios";
  required?: boolean;
  onChange?: (selectedIcons: T[]) => void;
};

const sizeCls: Record<SelectSize, string> = {
  medium: "w-8 h-8",
  large: "w-10 h-10",
};

export function useIconSelect<T>(
  options: IconOption<T>[],
  initialValues?: IconSelectInitialValues<T>,
  config?: IconSelectConfig<T>
) {
  const [selectedIcons, setSelectedIcons] = useState<T[]>(initialValues ? toArray(initialValues) : []);
  const { size = "medium", iconCls, selectedCls, multiple, required, onChange } = config || {};
  const withRadios = multiple === "withRadios";

  const updateSelectedIcons = (newTypes: T[]) => {
    if (!required || newTypes.length) {
      setSelectedIcons(newTypes);
      onChange?.(newTypes);
    }
  };

  const onClickIcon = (value: T, currentSelected: boolean) => {
    const newTypes = multiple
      ? currentSelected
        ? selectedIcons.filter((type) => type !== value)
        : selectedIcons.concat(value)
      : [value];

    updateSelectedIcons(newTypes);
  };

  const onCheckRadio = (value: T) => {
    updateSelectedIcons([value]);
  };

  const renderIconSelect = (className?: ClassValue) => (
    <div className={clsx("flex items-center gap-4", className)}>
      {options.map((option, i) => {
        const index = selectedIcons.indexOf(option.type);
        const selected = index !== -1;

        return (
          <div key={i} className="flex-center flex-col gap-4">
            <button
              type="button"
              className={clsx(
                "flex-center glow-on-hover rounded-circle transition duration-150",
                sizeCls[size],
                iconCls,
                selected && selectedCls
              )}
              onClick={() => onClickIcon(option.type, selected)}
            >
              {typeof option.icon === "string" ? <Image src={option.icon} /> : option.icon}
            </button>

            {withRadios && (
              <label className="w-8 h-8 flex-center cursor-pointer">
                <Radio
                  size="large"
                  checked={selectedIcons.length === 1 && selectedIcons[0] === option.type}
                  onChange={() => onCheckRadio(option.type)}
                />
              </label>
            )}
          </div>
        );
      })}
    </div>
  );

  return {
    selectedIcons,
    // allIconsSelected: selectedIcons.length === options.length,
    updateSelectedIcons,
    renderIconSelect,
  };
}
