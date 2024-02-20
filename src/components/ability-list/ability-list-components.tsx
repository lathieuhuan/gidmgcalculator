import clsx from "clsx";
import type { ReactNode } from "react";
import { FaCaretRight, FaQuestion } from "react-icons/fa";

import type { ElementType } from "@Src/types";
import { getImgSrc } from "@Src/utils";

import styles from "./styles.module.scss";

const ABILITY_ICON_SIZE = "3.25rem";

interface AbilityImgProps {
  className?: string;
  img?: string;
  elementType: ElementType;
  active?: boolean;
  onClick?: () => void;
}
export const AbilityIcon = ({ className, img, elementType, active = true, onClick }: AbilityImgProps) => {
  const commonClassNames = ["transition-opacity duration-150 ease-in-out", !active && "opacity-50"];
  const style = {
    width: ABILITY_ICON_SIZE,
    height: ABILITY_ICON_SIZE,
  };

  return img ? (
    <img
      className={clsx(commonClassNames, className)}
      src={getImgSrc(img)}
      alt=""
      style={style}
      draggable={false}
      onClick={onClick}
    />
  ) : (
    <div
      className={clsx(`rounded-circle bg-${elementType} flex-center`, styles[elementType], commonClassNames, className)}
      style={style}
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
        "absolute top-2 text-[2.5rem] text-dark-500 hover:text-blue-400 flex-center cursor-pointer " +
        (toRight ? "pl-4 pr-2 left-full" : "pl-2 pr-4 right-full")
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
        <div
          className="overflow-hidden relative"
          style={{
            width: ABILITY_ICON_SIZE,
            height: ABILITY_ICON_SIZE,
          }}
        >
          <div
            className="absolute top-0 flex transition-transform ease-linear"
            style={{ transform: `translateX(calc(-${currentIndex} * ${ABILITY_ICON_SIZE}))` }}
          >
            {images.map((img, i) => (
              <AbilityIcon key={i} img={img} elementType={elementType} />
            ))}
          </div>
        </div>

        {currentIndex > 0 && <Caret onClick={onClickBack} />}
        {currentIndex < images.length - 1 && <Caret toRight onClick={onClickNext} />}
      </div>
    </div>
  );
};
