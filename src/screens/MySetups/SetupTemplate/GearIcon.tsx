import { getImgSrc } from "@Src/utils";

interface GearIconProps {
  item: { beta?: boolean; icon: string; rarity?: number };
  disabled?: boolean;
  onClick?: () => void;
}
export const GearIcon = ({ item: { beta, icon, rarity }, disabled, onClick }: GearIconProps) => {
  return (
    <button
      className={
        `w-16 h-16 p-1 rounded flex bg-gradient-${rarity} ` +
        (onClick && !disabled ? "glow-on-hover" : "cursor-default opacity-50")
      }
      disabled={disabled}
      onClick={onClick}
    >
      <img src={getImgSrc(icon)} alt="" />
    </button>
  );
};
