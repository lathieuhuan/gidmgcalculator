import clsx, { ClassValue } from "clsx";
import { useState } from "react";

import { ARTIFACT_TYPE_IMAGES, WEAPON_TYPE_IMAGES } from "@Src/constants";
import { toArray } from "@Src/utils";
import { ArtifactType, WeaponType } from "@Src/types";
import { Image, Radio } from "@Src/pure-components";

type TypeImage<T> = {
  type: T;
  src: string;
};

type InitialValues<T> = T | T[] | null;

type Config<T> = {
  iconCls?: ClassValue;
  selectedCls?: ClassValue;
  multiple?: boolean | "withRadios";
  required?: boolean;
  onChange?: (selectedTypes: T[]) => void;
};

function useTypeSelect<T>(options: TypeImage<T>[], initialValues?: InitialValues<T>, config?: Config<T>) {
  const [selectedTypes, setSelectedTypes] = useState<T[]>(initialValues ? toArray(initialValues) : []);
  const { iconCls, selectedCls, multiple, required, onChange } = config || {};
  const withRadios = multiple === "withRadios";

  const updateTypes = (newTypes: T[]) => {
    setSelectedTypes(newTypes);
    onChange?.(newTypes);
  };

  const onClickIcon = (value: T, currentSelected: boolean) => {
    if (multiple) {
      const newTypes = currentSelected ? selectedTypes.filter((type) => type !== value) : selectedTypes.concat(value);

      if (!required || newTypes.length) {
        updateTypes(newTypes);
      }
    } else {
      updateTypes([value]);
    }
  };

  const onCheckRadio = (value: T) => {
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
              <Image src={option.src} />
            </button>

            {withRadios && (
              <label className="w-8 h-8 flex-center cursor-pointer">
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
}

function useWeaponTypeSelect(
  initialValues?: InitialValues<WeaponType>,
  config?: Omit<Config<WeaponType>, "selectedCls">
) {
  const finalConfig: Config<WeaponType> = {
    ...config,
    selectedCls: "shadow-3px-3px shadow-green-300",
  };
  return useTypeSelect(WEAPON_TYPE_IMAGES, initialValues, finalConfig);
}

function useArtifactTypeSelect(
  initialValues?: InitialValues<ArtifactType>,
  config?: Omit<Config<ArtifactType>, "iconCls" | "selectedCls">
) {
  const finalConfig: Config<ArtifactType> = {
    ...config,
    iconCls: "p-1",
    selectedCls: "bg-green-300",
  };
  return useTypeSelect(ARTIFACT_TYPE_IMAGES, initialValues, finalConfig);
}

useTypeSelect.Weapon = useWeaponTypeSelect;
useTypeSelect.Artifact = useArtifactTypeSelect;

export { useTypeSelect };
