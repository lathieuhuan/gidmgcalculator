import clsx from "clsx";
import { getImgSrc } from "@Src/utils";
import { findCharacter } from "@Data/controllers";

interface CharFilledSlotProps {
  className?: string;
  name: string;
  onClickIcon?: () => void;
}
export function CharacterPortrait({ className, name, onClickIcon }: CharFilledSlotProps) {
  const { code, icon } = findCharacter({ name })!;
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
        alt={name}
        draggable={false}
        onClick={onClickIcon}
      />
    </div>
  );
}
