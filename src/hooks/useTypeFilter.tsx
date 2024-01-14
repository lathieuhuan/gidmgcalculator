import clsx, { ClassValue } from "clsx";
import { useState } from "react";
import { ARTIFACT_ICONS, WEAPON_ICONS } from "@Src/constants";
import { Image } from "@Src/pure-components";

export const useTypeFilter = (
  itemType: "weapon" | "artifact",
  initialFilteredTypes: string[] = [],
  onChange?: (filteredTypes: string[]) => void
) => {
  const [filteredTypes, setFilteredTypes] = useState<string[]>(initialFilteredTypes);

  const icons = Object.entries(itemType === "weapon" ? WEAPON_ICONS : ARTIFACT_ICONS);

  const onClickIcon = (active: boolean, index: number, type: string) => {
    const newFilteredTypes = [...filteredTypes];
    if (active) {
      newFilteredTypes.splice(index, 1);
    } else {
      newFilteredTypes.push(type);
    }

    setFilteredTypes(newFilteredTypes);
    onChange?.(newFilteredTypes);
  };

  const updateFilter = (newFilteredTypes: string[]) => {
    setFilteredTypes(newFilteredTypes);
    onChange?.(newFilteredTypes);
  };

  const renderTypeFilter = (className?: ClassValue) => (
    <div className={clsx("mx-1 flex items-center gap-4", className)}>
      {icons.map(([type, src], i) => {
        const index = filteredTypes.indexOf(type);
        const active = index !== -1;

        return (
          <button
            key={i}
            className={clsx(
              "w-10 h-10 glow-on-hover rounded-circle transition duration-150",
              itemType === "artifact" && "p-1",
              active && (itemType === "weapon" ? "shadow-3px-3px shadow-green-300" : "bg-green-300")
            )}
            onClick={() => onClickIcon(active, index, type)}
          >
            <Image src={src} imgType={itemType} />
          </button>
        );
      })}
    </div>
  );

  return {
    filteredTypes,
    operate: {
      updateFilter,
    },
    renderTypeFilter,
  };
};
