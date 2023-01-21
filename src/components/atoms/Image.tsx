import clsx from "clsx";
import { useState } from "react";
import { IconType } from "react-icons/lib";
import { getImgSrc } from "@Src/utils";

interface ImageProps {
  className?: string;
  src: string;
  size?: string;
  Placeholder?: IconType;
}
export const Image = ({ className, src, size = "w-full h-full", Placeholder }: ImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      {!isLoaded && Placeholder && (
        <span className={className}>
          <Placeholder className={size} />
        </span>
      )}
      <img
        src={getImgSrc(src)}
        className={clsx(size, className, !isLoaded && "hidden")}
        draggable={false}
        onLoad={() => setIsLoaded(true)}
      />
    </>
  );
};
