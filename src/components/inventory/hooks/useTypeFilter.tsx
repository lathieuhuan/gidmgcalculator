import clsx from "clsx";
import { useState } from "react";

import { ARTIFACT_ICONS, WEAPON_ICONS } from "@Src/constants";
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
              "mr-4 w-10 h-10 glow-on-hover rounded-circle transition duration-150",
              itemType === "artifact" && "p-1",
              active && (itemType === "weapon" ? "shadow-3px-3px shadow-green-300" : "bg-green-300")
            )}
            onClick={() => onClickIcon(active, index, type)}
          >
            <img src={getImgSrc(src)} alt="" draggable={false} />
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
