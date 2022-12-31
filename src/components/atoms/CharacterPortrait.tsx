import clsx from "clsx";
import { getImgSrc } from "@Src/utils";

interface CharFilledSlotProps {
  className?: string;
  code: number;
  icon: string;
  onClickIcon?: () => void;
}
export function CharacterPortrait({ className, code, icon, onClickIcon }: CharFilledSlotProps) {
  // for the traveler
  const bgColorByCode: Record<number, string> = {
    1: "bg-anemo",
    12: "bg-geo",
    46: "bg-electro",
    57: "bg-dendro",
  };

  return (
    <div
      className={clsx(
        `zoomin-on-hover overflow-hidden rounded-circle ${bgColorByCode[code] || "bg-darkblue-3"}`,
        className
      )}
    >
      <img
        className="w-full rounded-circle"
        src={getImgSrc(icon)}
        alt=""
        draggable={false}
        onClick={onClickIcon}
      />
    </div>
  );
}
