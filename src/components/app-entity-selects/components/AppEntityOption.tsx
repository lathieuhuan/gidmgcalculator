import clsx from "clsx";
import { memo } from "react";
import { Image, BetaMark } from "@Src/pure-components";
import { ElementIcon } from "@Src/components";
import { Rarity, ElementType, WeaponType } from "@Src/types";

export type AppEntityOptionModel = {
  code: number;
  beta?: boolean;
  name: string;
  icon: string;
  rarity?: Rarity;
  vision?: ElementType;
  /** Weapon type or Artifact type */
  type?: string;
  weaponType?: WeaponType;
  cons?: number;
  artifactIDs?: (number | null)[];
};

interface AppEntityOptionProps {
  className?: string;
  visible: boolean;
  item: AppEntityOptionModel;
  selectedAmount?: number;
}
const AppEntityOptionCore = ({ className, visible, item, selectedAmount }: AppEntityOptionProps) => {
  const itemType = item.vision ? "character" : "weapon"; // not worth checking artifact or weapon

  return (
    <div className={clsx("rounded-lg cursor-pointer relative", className)}>
      <BetaMark active={item.beta} className="absolute top-0 left-0 z-10" />

      <div
        className={clsx(
          "overflow-hidden relative rounded-t-lg",
          item.rarity && `bg-gradient-${item.rarity}`,
          item.vision ? "pt-4" : "p-1"
        )}
      >
        <div className={"aspect-square transition-opacity duration-400 " + (visible ? "opacity-100" : "opacity-0")}>
          {visible && <Image src={item.icon} imgType={itemType} />}
        </div>

        {selectedAmount ? <p className="absolute bottom-0 right-1 text-black font-bold">{selectedAmount}</p> : null}
      </div>
      <p className="px-2 pt-1 rounded-b-lg text-sm truncate bg-light-400 text-black font-bold text-center">
        {item.name}
      </p>

      {item.vision && visible && (
        <div
          className={clsx(
            "absolute -top-1 -right-1 p-1 flex-center rounded-full bg-black shadow-white-glow",
            item.cons !== undefined && "flex rounded-2xl pl-1.5"
          )}
        >
          {item.cons !== undefined && <p className="mr-0.5 text-green-300">C{item.cons}</p>}
          <ElementIcon type={item.vision} />
        </div>
      )}
    </div>
  );
};

export const AppEntityOption = memo(AppEntityOptionCore, (prev, next) => {
  return prev.visible === next.visible && prev.selectedAmount === next.selectedAmount;
});
