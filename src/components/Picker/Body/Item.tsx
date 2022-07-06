import { BetaMark } from "@Components/minors";
import { VISION_ICONS } from "@Src/constants";
import { Element } from "@Src/types";
import { wikiImg } from "@Src/utils";
import cn from "classnames";
import { memo } from "react";

interface ItemProps {
  massAdd: boolean;
  item: {
    name: string;
    beta?: boolean;
    icon: string;
    constellation?: number;
    rarity: number;
    vision?: Element;
  };
  forChar: boolean;
  pickedAmount: number;
  pick: () => void;
}
function Item({ item, forChar, pickedAmount, pick }: ItemProps) {
  const hasCons = item.constellation !== undefined;
  const gradient = [
    "bg-gradient-1",
    "bg-gradient-2",
    "bg-gradient-3",
    "bg-gradient-4",
    "bg-gradient-5",
  ];
  return (
    <>
      <div className="cursor-pointer zoomin-on-hover relative" onClick={pick}>
        {item.beta && (
          <div className="absolute top-0 left-0 z-10">
            <BetaMark />
          </div>
        )}
        <div className="relative">
          <div
            className={cn(
              "overflow-hidden flex rounded-t-lg",
              gradient[item.rarity],
              forChar ? "pt-3" : "p-1"
            )}
          >
            <img
              src={item.beta && !forChar ? item.icon : wikiImg(item.icon)}
              alt=""
              className="w-full h-full"
              draggable={false}
            />
          </div>
          {!!pickedAmount && (
            <p className="absolute bottom-0 right-1 text-black font-bold">
              {pickedAmount}
            </p>
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
            { "flex rounded-2xl pl-1.5": hasCons }
          )}
        >
          {hasCons && (
            <p className="mr-0.5 text-green">C{item.constellation}</p>
          )}
          <img
            className="w-5"
            src={wikiImg(VISION_ICONS[item.vision])}
            alt="vision"
            draggable={false}
          />
        </div>
      )}
    </>
  );
}

const MemoItem = memo(Item, (prev, next) => {
  return (
    prev.massAdd === next.massAdd && prev.pickedAmount === next.pickedAmount
  );
});

export default MemoItem;