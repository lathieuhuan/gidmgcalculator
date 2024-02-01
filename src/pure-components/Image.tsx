import clsx from "clsx";
import { CSSProperties, useState } from "react";
import { FaUser, FaQuestion } from "react-icons/fa";
import { RiSwordFill } from "react-icons/ri";
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
  style?: CSSProperties;
  placeholderCls?: string;
  imgCls?: string;
  imgType?: "character" | "weapon" | "artifact";
  Placeholder?: (props: { className?: string }) => JSX.Element;
}
export const Image = ({
  src,
  size = "w-full h-full",
  className,
  style,
  placeholderCls,
  imgCls,
  imgType,
  Placeholder,
}: ImageProps) => {
  const [isError, setIsError] = useState(false);

  const PlaceholderIcon = Placeholder || (imgType ? ICONS_BY_TYPE[imgType] : null);

  return (
    <>
      {isError && PlaceholderIcon && (
        <div className={clsx("p-3", className)} style={style}>
          <PlaceholderIcon className={clsx(size, placeholderCls)} />
        </div>
      )}
      <img
        src={getImgSrc(src)}
        className={clsx(size, className, imgCls, isError && "hidden")}
        style={style}
        draggable={false}
        onError={() => setIsError(true)}
        onLoad={() => {
          if (isError) setIsError(false);
        }}
      />
    </>
  );
};
