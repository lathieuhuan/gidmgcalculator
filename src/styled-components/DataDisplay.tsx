import cn from "classnames";
import type { HTMLAttributes } from "react";
import type { Element } from "@Src/types";

type SpanExtraColor = "gold" | "green" | "orange";

interface SpanProps extends HTMLAttributes<HTMLSpanElement> {
  className?: "string";
  b?: boolean;
}
const makeSpan = (color: `text-${Element | SpanExtraColor}`) => {
  return ({ className, b, ...rest }: SpanProps) => (
    <span className={cn(color, b && "font-bold", className)} {...rest} />
  );
};

export const Green = makeSpan("text-green");
export const Gold = makeSpan("text-gold");
export const Pyro = makeSpan("text-pyro");
export const Hydro = makeSpan("text-hydro");
export const Electro = makeSpan("text-electro");
export const Dendro = makeSpan("text-dendro");
export const Cryo = makeSpan("text-cryo");
export const Anemo = makeSpan("text-anemo");
export const Geo = makeSpan("text-geo");

interface CollapseHeadingProps extends HTMLAttributes<HTMLParagraphElement> {
  active?: boolean;
}
export const CollapseHeading = (props: CollapseHeadingProps) => {
  const { className, active, ...rest } = props;
  return (
    <p
      className={cn(
        "pt-1 px-4 bg-darkblue-3 font-bold text-lg leading-relaxed",
        active && "bg-[#f5dc6e] text-black",
        className
      )}
      {...rest}
    />
  );
};