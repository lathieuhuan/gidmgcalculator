import clsx from "clsx";
import type { Rarity } from "@Src/types";
import { getImgSrc } from "@Src/utils";

export const renderGearIcon = (
  { beta, icon, rarity }: { beta?: boolean; icon: string; rarity?: Rarity },
  onClick?: () => void,
  key?: number | string
) => {
  return (
    <button
      key={key}
      className={clsx(
        `p-1 rounded flex bg-gradient-${rarity}`,
        onClick ? "glow-on-hover" : "cursor-default !opacity-50"
      )}
      onClick={onClick}
    >
      <img className="w-14 h-14" src={getImgSrc(icon)} alt="" />
    </button>
  );
};
