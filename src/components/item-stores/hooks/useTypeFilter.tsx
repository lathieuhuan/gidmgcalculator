import { useState } from "react";
import cn from "classnames";
import { ARTIFACT_ICONS, WEAPON_ICONS } from "@Src/constants";
import { wikiImg } from "@Src/utils";

export function useTypeFilter(forWeapon: boolean, initialTypes?: string[]) {
  const [types, setTypes] = useState<string[]>(initialTypes || []);
  const icons = Object.entries(forWeapon ? WEAPON_ICONS : ARTIFACT_ICONS);

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

  const typeFilter = (
    <div className="mx-1 flex items-center">
      {icons.map(([type, src], i) => {
        const index = types.indexOf(type);
        const active = index !== -1;

        return (
          <button
            key={i}
            className={cn(
              "mr-4 glow-on-hover rounded-circle transition duration-150",
              !forWeapon && "p-1",
              active && (forWeapon ? "shadow-3px-3px shadow-green" : "bg-green")
            )}
            onClick={() => onClickIcon(active, index, type)}
          >
            <img
              className={cn(forWeapon ? "w-10" : "w-8")}
              src={wikiImg(src)}
              alt=""
              draggable={false}
            />
          </button>
        );
      })}
    </div>
  );

  return [typeFilter, types, setTypes] as const;
}
