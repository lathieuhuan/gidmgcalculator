import clsx from "clsx";
import type { HTMLAttributes } from "react";
import type { Vision } from "@Src/types";

type SpanExtraColor =
  | "gold"
  | "lightgold"
  | "lightred"
  | "green"
  | "orange"
  | "lesser"
  | "rose-500";

interface SpanProps extends HTMLAttributes<HTMLSpanElement> {
  className?: string;
  b?: boolean;
}
const makeSpan = (color: `text-${Vision | SpanExtraColor}`) => {
  return ({ className, b, ...rest }: SpanProps) => (
    <span className={clsx(color, b && "font-bold", className)} {...rest} />
  );
};

export const Green = makeSpan("text-green");
export const Red = makeSpan("text-lightred");
export const Lightgold = makeSpan("text-lightgold");
export const Lesser = makeSpan("text-lesser");
export const Gold = makeSpan("text-gold");
export const Pyro = makeSpan("text-pyro");
export const Hydro = makeSpan("text-hydro");
export const Electro = makeSpan("text-electro");
export const Dendro = makeSpan("text-dendro");
export const Cryo = makeSpan("text-cryo");
export const Anemo = makeSpan("text-anemo");
export const Geo = makeSpan("text-geo");
export const Rose = makeSpan("text-rose-500");

export const BetaMark = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={clsx(
      "rounded px-1 bg-white text-red-500 border-2 border-red-500 text-xs font-bold cursor-default",
      className
    )}
    {...rest}
  >
    BETA
  </div>
);

interface SeeDetailsProps extends HTMLAttributes<HTMLParagraphElement> {
  active?: boolean;
}
export const SeeDetails = (props: SeeDetailsProps) => {
  const { className, active, ...rest } = props;
  return (
    <p
      className={clsx(
        "cursor-pointer",
        active ? "text-green" : "text-default hover:text-lightgold",
        className
      )}
      {...rest}
    >
      See details
    </p>
  );
};

interface StarLineProps {
  className?: string;
  rarity: number;
}
export const StarLine = ({ rarity, className }: StarLineProps) => {
  return (
    <div className={clsx("flex items-center", className)}>
      {[...Array(rarity)].map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={clsx("w-5 h-5", rarity === 5 ? "fill-rarity-5" : "fill-rarity-4")}
        >
          <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
        </svg>
      ))}
    </div>
  );
};
