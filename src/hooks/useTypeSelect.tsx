import clsx, { ClassValue } from "clsx";
import { useState } from "react";
import { Image, Radio } from "@Src/pure-components";
import { ARTIFACT_IMAGES, WEAPON_IMAGES } from "@Src/constants";

type TypeOption = {
  type: string;
  imgSrc: string;
};

type Config = {
  iconCls?: ClassValue;
  selectedCls?: ClassValue;
  multiple?: boolean;
  required?: boolean;
  withRadios?: boolean;
  onChange?: (selectedTypes: string[]) => void;
};

const useTypeSelect = (options: TypeOption[], initialValues?: string[] | null, config?: Config) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(initialValues ?? []);
  const { iconCls, selectedCls, multiple, required, withRadios, onChange } = config || {};

  const updateTypes = (newTypes: string[]) => {
    setSelectedTypes(newTypes);
    onChange?.(newTypes);
  };

  const onClickIcon = (value: string, currentSelected: boolean) => {
    if (multiple) {
      const newTypes = currentSelected ? selectedTypes.filter((type) => type !== value) : selectedTypes.concat(value);

      if (!required || newTypes.length) {
        updateTypes(newTypes);
      }
    } else {
      updateTypes([value]);
    }
  };

  const onCheckRadio = (value: string) => {
    updateTypes([value]);
  };

  const renderTypeSelect = (className?: ClassValue) => (
    <div className={clsx("flex items-center gap-4", className)}>
      {options.map((option, i) => {
        const index = selectedTypes.indexOf(option.type);
        const selected = index !== -1;

        return (
          <div key={i} className="flex-center flex-col gap-4">
            <button
              type="button"
              className={clsx(
                "w-10 h-10 glow-on-hover rounded-circle transition duration-150",
                iconCls,
                selected && selectedCls
              )}
              onClick={() => onClickIcon(option.type, selected)}
            >
              <Image src={option.imgSrc} />
            </button>

            {withRadios && (
              <label className="w-8 h-8 flex-center">
                <Radio
                  size="large"
                  checked={selectedTypes.length === 1 && selectedTypes[0] === option.type}
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
    selectedTypes,
    allTypesSelected: selectedTypes.length === options.length,
    updateTypes,
    renderTypeSelect,
  };
};

useTypeSelect.Weapon = (initialValues?: string[] | null, config?: Omit<Config, "selectedCls">) => {
  const finalConfig: Config = {
    ...config,
    selectedCls: "shadow-3px-3px shadow-green-300",
  };
  return useTypeSelect(WEAPON_IMAGES, initialValues, finalConfig);
};

useTypeSelect.Artifact = (initialValues?: string[] | null, config?: Omit<Config, "iconCls" | "selectedCls">) => {
  const finalConfig: Config = {
    ...config,
    iconCls: "p-1",
    selectedCls: "bg-green-300",
  };
  return useTypeSelect(ARTIFACT_IMAGES, initialValues, finalConfig);
};

export { useTypeSelect };
