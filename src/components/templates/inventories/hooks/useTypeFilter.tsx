import clsx from "clsx";
import { useState } from "react";

// Constant
import { ARTIFACT_ICONS, WEAPON_ICONS } from "@Src/constants";

// Util
import { getImgSrc } from "@Src/utils";

interface UseTypeFilterArgs {
  itemType: "weapon" | "artifact";
  initialTypes?: string[];
}
export function useTypeFilter({ itemType, initialTypes = [] }: UseTypeFilterArgs) {
  const [types, setTypes] = useState<string[]>(initialTypes);

  const icons = Object.entries(itemType === "weapon" ? WEAPON_ICONS : ARTIFACT_ICONS);

  const onClickIcon = (active: boolean, index: number, type: string) => {
    setTypes((prev) => {
      const newTypes = [...prev];
      if (active) {
        newTypes.splice(index, 1);
      } else {
        newTypes.push(type);
      }
      return newTypes;
    });
  };

  const renderTypeFilter = () => (
    <div className="mx-1 flex items-center">
      {icons.map(([type, src], i) => {
        const index = types.indexOf(type);
        const active = index !== -1;

        return (
          <button
            key={i}
            className={clsx(
              "mr-4 glow-on-hover rounded-circle transition duration-150",
              itemType === "artifact" && "p-1",
              active && (itemType === "weapon" ? "shadow-3px-3px shadow-green" : "bg-green")
            )}
            onClick={() => onClickIcon(active, index, type)}
          >
            <img
              className={clsx(itemType === "weapon" ? "w-10" : "w-8")}
              src={getImgSrc(src)}
              alt=""
              draggable={false}
            />
          </button>
        );
      })}
    </div>
  );

  return {
    filteredTypes: types,
    setFilteredType: setTypes,
    renderTypeFilter,
  };
}
