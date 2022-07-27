import { memo } from "react";
import cn from "classnames";
import { BetaMark } from "@Components/minors";
import { VISION_ICONS } from "@Src/constants";
import { wikiImg } from "@Src/utils";
import { PickerItem } from "./types";

interface ItemProps {
  massAdd: boolean;
  item: PickerItem;
  pickedAmount: number;
  onClickItem: () => void;
}
function Item({ item, pickedAmount, onClickItem }: ItemProps) {
  return (
    <div className={cn("relative", item.vision ? "p-1.5 sm:pt-3 sm:pr-3 md1:p-2" : "p-1 sm:p-2")}>
      <div className="cursor-pointer zoomin-on-hover relative" onClick={onClickItem}>
        {item.beta && <BetaMark className="absolute top-0 left-0 z-10" />}

        <div className="relative">
          <div
            className={cn(
              `overflow-hidden flex bg-gradient-${item.rarity} rounded-t-lg`,
              item.vision ? "pt-4" : "p-1"
            )}
          >
            <img
              src={item.beta && !item.vision ? item.icon : wikiImg(item.icon)}
              alt=""
              className="w-full h-full"
              draggable={false}
            />
          </div>
          {!!pickedAmount && (
            <p className="absolute bottom-0 right-1 text-black font-bold">{pickedAmount}</p>
          )}
        </div>
        <p className="px-2 rounded-b-lg truncate bg-default text-black font-bold text-center">
          {item.name}
        </p>
      </div>
      {item.vision && (
        <div
          className={cn(
            "absolute top-0.5 right-0.5 p-1 rounded-full bg-black shadow-[0_0_2px_white]",
            { "flex rounded-2xl pl-1.5": item.constellation }
          )}
        >
          {item.constellation && <p className="mr-0.5 text-green">C{item.constellation}</p>}
          <img
            className="w-5"
            src={wikiImg(VISION_ICONS[item.vision])}
            alt="vision"
            draggable={false}
          />
        </div>
      )}
    </div>
  );
}

const MemoItem = memo(Item, (prev, next) => {
  return prev.massAdd === next.massAdd && prev.pickedAmount === next.pickedAmount;
});

export default MemoItem;
