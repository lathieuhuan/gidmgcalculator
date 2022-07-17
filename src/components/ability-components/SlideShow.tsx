import type { ReactNode } from "react";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import cn from "classnames";
import { Vision } from "@Src/types";
import AbilityIcon from "./Icon";

interface SlideShowProps {
  currentIndex: number;
  images: string[];
  vision: Vision;
  forTalent: boolean;
  topLeftNote?: ReactNode;
  onClickBack: () => void;
  onClickNext: () => void;
}
export default function SlideShow({
  currentIndex,
  images,
  vision,
  forTalent,
  topLeftNote,
  onClickBack,
  onClickNext,
}: SlideShowProps) {
  return (
    <div className={cn("flex-center relative", forTalent ? "pt-1 pb-2" : "pt-2 pb-4")}>
      {topLeftNote}
      <div className="relative">
        <div className="w-14 h-14 overflow-hidden relative">
          <div
            className="absolute top-0 flex transition-transform ease-linear"
            style={{ transform: `translateX(-${currentIndex * 3.5}rem)` }}
          >
            {images.map((img, i) => (
              <AbilityIcon key={i} className="!w-14 !h-14" img={img} vision={vision} />
            ))}
          </div>
        </div>
        {currentIndex > 0 && <Caret toRight={false} onClick={onClickBack} />}
        {currentIndex < images.length - 1 && <Caret toRight onClick={onClickNext} />}
      </div>
    </div>
  );
}

interface CaretProps {
  toRight: boolean;
  onClick: () => void;
}
function Caret({ toRight, onClick }: CaretProps) {
  const Icon = toRight ? FaCaretRight : FaCaretLeft;
  return (
    <button
      className={cn(
        "absolute top-2 text-[2.5rem] text-darkblue-3 hover:text-lightgold flex-center cursor-pointer",
        toRight ? "pl-4 pr-2 left-full" : "pl-2 pr-4 left right-full"
      )}
      onClick={onClick}
    >
      <Icon />
    </button>
  );
}
