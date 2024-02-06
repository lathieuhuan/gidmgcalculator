import clsx, { ClassValue } from "clsx";
import { useState } from "react";
import { ARTIFACT_ICONS, WEAPON_ICONS } from "@Src/constants";
import { Image, Radio } from "@Src/pure-components";

export const useTypeFilter = (
  itemType: "weapon" | "artifact",
  initialFilteredTypes: string[] = [],
  options?: {
    /** Default to 'multi' */
    mode?: "single" | "multi";
    required?: boolean;
    withRadios?: boolean;
    onChange?: (filteredTypes: string[]) => void;
  }
) => {
  const [types, setTypes] = useState<string[]>(initialFilteredTypes);

  const { mode = "multi", required, withRadios, onChange } = options || {};
  const icons = Object.entries(itemType === "weapon" ? WEAPON_ICONS : ARTIFACT_ICONS);

  const onClickIcon = (active: boolean, index: number, type: string) => {
    if (mode === "single") {
      setTypes([type]);
      return;
    }

    const newTypes = [...types];
    if (active) {
      newTypes.splice(index, 1);
    } else {
      newTypes.push(type);
    }

    if (!required || newTypes.length) {
      setTypes(newTypes);
      onChange?.(newTypes);
    }
  };

  const updateFilter = (newTypes: string[]) => {
    setTypes(newTypes);
    onChange?.(newTypes);
  };

  const onCheckRadio = (type: string) => {
    setTypes([type]);
  };

  const renderTypeFilter = (className?: ClassValue) => (
    <div className={clsx("flex items-center gap-4", className)}>
      {icons.map(([type, src], i) => {
        const index = types.indexOf(type);
        const active = index !== -1;

        return (
          <div key={i} className="flex-center flex-col gap-4">
            <button
              type="button"
              className={clsx(
                "w-10 h-10 glow-on-hover rounded-circle transition duration-150",
                itemType === "artifact" && "p-1",
                active && (itemType === "weapon" ? "shadow-3px-3px shadow-green-300" : "bg-green-300")
              )}
              onClick={() => onClickIcon(active, index, type)}
            >
              <Image src={src} imgType={itemType} />
            </button>

            {withRadios && (
              <label className="w-8 h-8 flex-center">
                <Radio
                  size="large"
                  checked={types.length === 1 && types[0] === type}
                  onChange={() => onCheckRadio(type)}
                />
              </label>
            )}
          </div>
        );
      })}
    </div>
  );

  return {
    filteredTypes: types,
    allSelected: types.length === icons.length,
    operate: {
      updateFilter,
    },
    renderTypeFilter,
  };
};
