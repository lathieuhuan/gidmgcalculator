import clsx from "clsx";
import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { RiSwordFill } from "react-icons/ri";
import type { IconType } from "react-icons/lib";

import { getImgSrc } from "@Src/utils";

const ICONS_BY_TYPE = {
  character: FaUser,
  weapon: RiSwordFill,
  artifact: RiSwordFill,
};

interface ImageProps {
  src: string;
  size?: string;
  className?: string;
  placeHolderClassName?: string;
  imgClassName?: string;
  imgType?: "character" | "weapon" | "artifact";
  Placeholder?: IconType;
}
export const Image = ({
  className,
  placeHolderClassName,
  imgClassName,
  src,
  size = "w-full h-full",
  imgType,
  Placeholder,
}: ImageProps) => {
  const [isError, setIsError] = useState(false);

  const PlaceholderIcon = Placeholder || (imgType ? ICONS_BY_TYPE[imgType] : null);

  return (
    <>
      {isError && PlaceholderIcon && (
        <div className={className}>
          <PlaceholderIcon className={clsx(size, placeHolderClassName)} />
        </div>
      )}
      <img
        src={getImgSrc(src)}
        className={clsx(size, className, imgClassName, isError && "hidden")}
        draggable={false}
        onError={() => setIsError(true)}
        onLoad={() => {
          if (isError) {
            setIsError(false);
          }
        }}
      />
    </>
  );
};
