import cn from "classnames";
import { FaQuestion } from "react-icons/fa";
import type { Vision } from "@Src/types";
import { wikiImg } from "@Src/utils";
import { bgColorByVision } from "@Styled/tw-compounds";
import styles from "./styles.module.scss";

interface AbilityImgProps {
  className?: string;
  img: string;
  vision: Vision;
  active?: boolean;
  onClick?: () => void;
}
export default function AbilityIcon({
  className,
  img,
  vision,
  active = true,
  onClick,
}: AbilityImgProps) {
  const tw = cn("transition-opacity duration-150 ease-out", !active && "opacity-50");

  return img ? (
    <img
      className={cn(tw, "min-w-13 h-13", className)}
      src={wikiImg(img)}
      alt=""
      draggable={false}
      onClick={onClick}
    />
  ) : (
    <div
      className={cn(
        tw,
        "min-w-13 h-13 rounded-full flex-center",
        bgColorByVision[vision],
        styles[vision],
        className
      )}
      onClick={onClick}
    >
      <FaQuestion size="1.25rem" />
    </div>
  );
}
