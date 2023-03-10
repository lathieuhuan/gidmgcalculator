import { memo } from "react";
import type { DataType, PickerItem } from "../types";

// Constant
import { VISION_ICONS } from "@Src/constants";

// Component
import { BetaMark, Image } from "@Components/atoms";

interface ItemProps {
  visible: boolean;
  item: PickerItem;
  itemType: DataType;
  pickedAmount: number;
}
const Item = ({ visible, item, itemType, pickedAmount }: ItemProps) => {
  return (
    <div>
      <div className="cursor-pointer zoomin-on-hover relative">
        {item.beta && <BetaMark className="absolute top-0 left-0 z-10" />}

        <div
          className={
            `overflow-hidden relative bg-gradient-${item.rarity} rounded-t-lg ` +
            (item.vision ? "pt-4" : "p-1")
          }
        >
          <div
            className={
              "aspect-square transition-opacity duration-400 " +
              (visible ? "opacity-100" : "opacity-0")
            }
          >
            {visible && <Image src={item.icon} imgType={itemType} />}
          </div>

          {pickedAmount ? (
            <p className="absolute bottom-0 right-1 text-black font-bold">{pickedAmount}</p>
          ) : null}
        </div>
        <p className="px-2 pt-1 rounded-b-lg text-sm truncate bg-default text-black font-bold text-center">
          {item.name}
        </p>
      </div>
      {item.vision && visible && (
        <div
          className={
            "absolute top-0.5 right-0.5 p-1 flex items-center rounded-full bg-black shadow-white-glow" +
            (item.cons !== undefined ? " flex rounded-2xl pl-1.5" : "")
          }
        >
          {item.cons !== undefined && <p className="mr-0.5 text-green">C{item.cons}</p>}
          <Image size="w-5 h-5" src={VISION_ICONS[item.vision]} />
        </div>
      )}
    </div>
  );
};

export const MemoItem = memo(Item, (prev, next) => {
  return prev.visible === next.visible && prev.pickedAmount === next.pickedAmount;
});
