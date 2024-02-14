import clsx from "clsx";
import type { ReactNode } from "react";
import { FaCaretRight, FaQuestion } from "react-icons/fa";

import type { ElementType } from "@Src/types";
import { getImgSrc } from "@Src/utils";

import styles from "./styles.module.scss";

interface AbilityImgProps {
  className?: string;
  img?: string;
  elementType: ElementType;
  active?: boolean;
  onClick?: () => void;
}
export const AbilityIcon = ({ className, img, elementType, active = true, onClick }: AbilityImgProps) => {
  const commonClassNames = ["min-w-13 h-13 transition-opacity duration-150 ease-in-out", !active && "opacity-50"];

  return img ? (
    <img
      className={clsx(commonClassNames, className)}
      src={getImgSrc(img)}
      alt=""
      draggable={false}
      onClick={onClick}
    />
  ) : (
    <div
      className={clsx(`rounded-circle bg-${elementType} flex-center`, styles[elementType], commonClassNames, className)}
      onClick={onClick}
    >
      <FaQuestion className="text-xl" />
    </div>
  );
};

interface CaretProps {
  toRight?: boolean;
  onClick: () => void;
}
const Caret = ({ toRight, onClick }: CaretProps) => {
  return (
    <button
      className={
        "absolute top-2 text-[2.5rem] text-dark-500 hover:text-yellow-400 flex-center cursor-pointer " +
        (toRight ? "pl-4 pr-2 left-full" : "pl-2 pr-4 left right-full")
      }
      onClick={onClick}
    >
      <FaCaretRight className={toRight ? "" : "rotate-180"} />
    </button>
  );
};

interface SlideShowProps {
  currentIndex: number;
  images: (string | undefined)[];
  elementType: ElementType;
  forTalent: boolean;
  topLeftNote?: ReactNode;
  onClickBack: () => void;
  onClickNext: () => void;
}
export const SlideShow = ({
  currentIndex,
  images,
  elementType,
  forTalent,
  topLeftNote,
  onClickBack,
  onClickNext,
}: SlideShowProps) => {
  return (
    <div className={"flex-center relative " + (forTalent ? "pt-1 pb-2" : "pt-2 pb-4")}>
      {topLeftNote}

      <div className="relative">
        <div className="w-14 h-14 overflow-hidden relative">
          <div
            className="absolute top-0 flex transition-transform ease-linear"
            style={{ transform: `translateX(-${currentIndex * 3.5}rem)` }}
          >
            {images.map((img, i) => (
              <AbilityIcon key={i} className="!min-w-[3.5rem] !w-14 !h-14" img={img} elementType={elementType} />
            ))}
          </div>
        </div>

        {currentIndex > 0 && <Caret onClick={onClickBack} />}
        {currentIndex < images.length - 1 && <Caret toRight onClick={onClickNext} />}
      </div>
    </div>
  );
};
