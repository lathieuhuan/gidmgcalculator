import clsx from "clsx";

import type { Filter } from "../types";
import { VISION_ICONS, WEAPON_ICONS } from "@Src/constants";
import { getImgSrc } from "@Src/utils";

interface CharacterFilterProps extends Filter {
  onClickOption: (isChosen: boolean, newFilter: Filter) => void;
}
export const CharacterFilter = (props: CharacterFilterProps) => {
  const { type, value, onClickOption } = props;

  return (
    <div className="px-4">
      <div className="py-4 flex flex-wrap justify-around">
        <div className="flex overflow-auto hide-scrollbar">
          {Object.entries(VISION_ICONS).map(([elmtType, src], i) => {
            const chosen = type === "vision" && value === elmtType;
            return (
              <img
                key={i}
                className={clsx("cursor-pointer rounded-full w-8 h-8 lg:w-10 lg:h-10", {
                  "ml-6": i,
                  "border-3 border-white": chosen,
                })}
                src={getImgSrc(src)}
                alt={elmtType}
                draggable={false}
                onClick={() => {
                  onClickOption(chosen, { type: "vision", value: elmtType });
                }}
              />
            );
          })}
        </div>

        <div className="flex overflow-auto hide-scrollbar">
          {Object.entries(WEAPON_ICONS).map(([wpType, src], i) => {
            const chosen = type === "weaponType" && value === wpType;
            return (
              <img
                key={i}
                className={clsx("cursor-pointer rounded-full w-9 h-9 mt-6 md2:mt-0 lg:w-11 lg:h-11", {
                  "ml-6": i,
                  "border-3 border-white": chosen,
                })}
                src={getImgSrc(src)}
                alt={wpType}
                draggable={false}
                onClick={() => {
                  onClickOption(chosen, { type: "weaponType", value: wpType });
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
