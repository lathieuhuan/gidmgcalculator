import type { Rarity } from "@Src/types";
import { getImgSrc } from "@Src/utils";

interface IGearIconProps {
  item: { beta?: boolean; icon: string; rarity?: Rarity };
  onClick?: () => void;
}
export const GearIcon = ({ item: { beta, icon, rarity }, onClick }: IGearIconProps) => {
  return (
    <button
      className={
        `w-14 h-14 p-1 rounded flex bg-gradient-${rarity} ` +
        (onClick ? "glow-on-hover" : "cursor-default opacity-50")
      }
      onClick={onClick}
    >
      <img src={getImgSrc(icon)} alt="" />
    </button>
  );
};
