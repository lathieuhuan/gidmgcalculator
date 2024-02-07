import clsx from "clsx";

import type { Filter } from "../types";
import { VISION_TYPES, WEAPON_TYPE_IMAGES } from "@Src/constants";
import { getImgSrc } from "@Src/utils";
import { Vision } from "@Src/pure-components";

interface CharacterFilterProps extends Filter {
  onClickOption: (isChosen: boolean, newFilter: Filter) => void;
}
export const CharacterFilter = (props: CharacterFilterProps) => {
  const { type, value, onClickOption } = props;

  return (
    <div className="px-4">
      <div className="py-4 flex flex-wrap justify-around">
        <div className="flex overflow-auto hide-scrollbar">
          {VISION_TYPES.map((vision, i) => {
            const chosen = type === "vision" && value === vision;

            return (
              <button
                key={i}
                className={clsx("cursor-pointer rounded-full w-8 h-8 lg:w-10 lg:h-10 shrink-0 flex-center", {
                  "ml-6": i,
                  "border-3 border-light-400": chosen,
                })}
                onClick={() => {
                  onClickOption(chosen, { type: "vision", value: vision });
                }}
              >
                <Vision type={vision} size="80%" />
              </button>
            );
          })}
        </div>

        <div className="flex overflow-auto hide-scrollbar">
          {WEAPON_TYPE_IMAGES.map((item, i) => {
            const chosen = type === "weaponType" && value === item.type;
            return (
              <img
                key={i}
                className={clsx("cursor-pointer rounded-full w-9 h-9 mt-6 md2:mt-0 lg:w-11 lg:h-11 shrink-0", {
                  "ml-6": i,
                  "border-3 border-light-400": chosen,
                })}
                src={getImgSrc(item.src)}
                alt={item.type}
                draggable={false}
                onClick={() => {
                  onClickOption(chosen, { type: "weaponType", value: item.type });
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
