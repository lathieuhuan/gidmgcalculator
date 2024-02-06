import clsx from "clsx";
import { memo } from "react";
import { PickedItem } from "../types";
import { Image, BetaMark, Vision } from "@Src/pure-components";
import { PickedChar } from "@Store/utils";

interface PickerItemViewProps {
  visible: boolean;
  item: PickedItem;
  pickedAmount?: number;
}
function PickerItemView({ visible, item, pickedAmount }: PickerItemViewProps) {
  const itemType = item.vision ? "character" : item.weaponType ? "weapon" : "artifact";

  return (
    <div>
      <div className="cursor-pointer zoomin-on-hover relative">
        {item.beta && <BetaMark className="absolute top-0 left-0 z-10" />}

        <div
          className={clsx(
            "overflow-hidden relative rounded-t-lg",
            item.rarity && `bg-gradient-${item.rarity}`,
            item.vision ? "pt-4" : "p-1"
          )}
        >
          <div className={"aspect-square transition-opacity duration-400 " + (visible ? "opacity-100" : "opacity-0")}>
            {visible && (
              <Image
                src={item.icon}
                // imgType={itemType}
              />
            )}
          </div>

          {pickedAmount ? <p className="absolute bottom-0 right-1 text-black font-bold">{pickedAmount}</p> : null}
        </div>
        <p className="px-2 pt-1 rounded-b-lg text-sm truncate bg-light-400 text-black font-bold text-center">
          {item.name}
        </p>
      </div>

      {item.vision && visible && (
        <div
          className={
            "absolute top-0.5 right-0.5 p-1 flex-center rounded-full bg-black shadow-white-glow" +
            (item.cons !== undefined ? " flex rounded-2xl pl-1.5" : "")
          }
        >
          {item.cons !== undefined && <p className="mr-0.5 text-green-300">C{item.cons}</p>}
          <Vision type={item.vision} />
        </div>
      )}
    </div>
  );
}

export const MemoPickerItemView = memo(PickerItemView, (prev, next) => {
  return prev.visible === next.visible && prev.pickedAmount === next.pickedAmount;
});
