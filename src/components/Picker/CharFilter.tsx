import cn from "classnames";
import { VISION_ICONS, WEAPON_ICONS, WEAPON_TYPES } from "@Src/constants";
import { wikiImg } from "@Src/utils";
import { Filter } from "./types";

export interface CharFilterProps extends Filter {
  onClickOption: (isChosen: boolean, newFilter: Filter) => void;
}
export default function CharFilter(props: CharFilterProps) {
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
                className={cn("cursor-pointer rounded-full w-8 h-8 lg:w-10 lg:h-10", {
                  "ml-6": i,
                  "border-3 border-white": chosen,
                })}
                src={wikiImg(src)}
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
            const chosen = type === "weapon" && value === wpType;
            return (
              <img
                key={i}
                className={cn("cursor-pointer rounded-full w-9 h-9 mt-6 md2:mt-0 lg:w-11 lg:h-11", {
                  "ml-6": i,
                  "border-3 border-white": chosen,
                })}
                src={wikiImg(src)}
                alt={wpType}
                draggable={false}
                onClick={() => {
                  onClickOption(chosen, { type: "weapon", value: wpType });
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
