import clsx from "clsx";
import type { ReactNode } from "react";
import { FaCaretRight, FaQuestion } from "react-icons/fa";

import type { Vision } from "@Src/types";
import { getImgSrc } from "@Src/utils";
import styles from "./styles.module.scss";

interface AbilityImgProps {
  className?: string;
  img: string;
  vision: Vision;
  active?: boolean;
  onClick?: () => void;
}
export function AbilityIcon({ className, img, vision, active = true, onClick }: AbilityImgProps) {
  const commonClassNames = ["transition-opacity duration-150 ease-in-out", !active && "opacity-50"];

  return img ? (
    <img
      className={clsx("min-w-13 h-13", commonClassNames, className)}
      src={getImgSrc(img)}
      alt=""
      draggable={false}
      onClick={onClick}
    />
  ) : (
    <div
      className={clsx(
        `min-w-13 h-13 rounded-full bg-${vision} flex-center`,
        styles[vision],
        commonClassNames,
        className
      )}
      onClick={onClick}
    >
      <FaQuestion size="1.25rem" />
    </div>
  );
}

interface SlideShowProps {
  currentIndex: number;
  images: string[];
  vision: Vision;
  forTalent: boolean;
  topLeftNote?: ReactNode;
  onClickBack: () => void;
  onClickNext: () => void;
}
export function SlideShow({
  currentIndex,
  images,
  vision,
  forTalent,
  topLeftNote,
  onClickBack,
  onClickNext,
}: SlideShowProps) {
  return (
    <div className={clsx("flex-center relative", forTalent ? "pt-1 pb-2" : "pt-2 pb-4")}>
      {topLeftNote}
      <div className="relative">
        <div className="w-14 h-14 overflow-hidden relative">
          <div
            className="absolute top-0 flex transition-transform ease-linear"
            style={{ transform: `translateX(-${currentIndex * 3.5}rem)` }}
          >
            {images.map((img, i) => (
              <AbilityIcon
                key={i}
                className="!min-w-[3.5rem] !w-14 !h-14"
                img={img}
                vision={vision}
              />
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
  return (
    <button
      className={clsx(
        "absolute top-2 text-[2.5rem] text-darkblue-3 hover:text-lightgold flex-center cursor-pointer",
        toRight ? "pl-4 pr-2 left-full" : "pl-2 pr-4 left right-full"
      )}
      onClick={onClick}
    >
      <FaCaretRight className={clsx(!toRight && "rotate-180")} />
    </button>
  );
}
