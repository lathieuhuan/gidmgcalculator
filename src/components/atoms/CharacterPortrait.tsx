import clsx from "clsx";
import { Image } from "./Image";

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
        "w-full h-full zoomin-on-hover overflow-hidden rounded-circle",
        `${bgColorByCode[code] || "bg-darkblue-3"}`,
        className
      )}
      onClick={onClickIcon}
    >
      <Image src={icon} imgType="character" />
    </div>
  );
}
