import cn from "classnames";
import { VISION_ICONS, WEAPON_TYPES } from "@Src/constants";
import { wikiImg } from "@Src/utils";
import { Filter, FilterFn } from "../types";

export interface CharFilterProps extends Filter {
  setFilter: FilterFn;
  closeFilter: () => void;
}
export default function CharFilter(props: CharFilterProps) {
  const { type, value, setFilter, closeFilter } = props;

  return (
    <div className="px-3">
      <div className="py-3 flex flex-wrap justify-around">
        <div className="flex overflow-auto hide-scrollbar">
          {Object.entries(VISION_ICONS).map(([elmtType, src], i) => {
            const chosen = type === "vision" && value === elmtType;
            return (
              <img
                key={i}
                className={cn(
                  "cursor-pointer rounded-full w-8 h-8 lg:w-10 lg:h-10",
                  {
                    "ml-4": i,
                    "border-3 border-white": chosen,
                  }
                )}
                src={wikiImg(src)}
                alt={elmtType}
                draggable={false}
                onClick={() => {
                  setFilter(chosen, { type: "vision", value: elmtType });
                  closeFilter();
                }}
              />
            );
          })}
        </div>

        <div className="flex overflow-auto hide-scrollbar">
          {Object.entries(WEAPON_TYPES).map(([wpType, src], i) => {
            const chosen = type === "weapon" && value === wpType;
            return (
              <img
                key={i}
                className={cn(
                  "cursor-pointer rounded-full w-9 h-9 mt-4 md2:mt-0 lg:w-11 lg:h-11",
                  {
                    "ml-4": i,
                    "border-3 border-white": chosen,
                  }
                )}
                src={wikiImg(src)}
                alt={wpType}
                draggable={false}
                onClick={() => {
                  setFilter(chosen, { type: "weapon", value: wpType });
                  closeFilter();
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
