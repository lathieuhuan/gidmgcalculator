import type { Element } from "@Src/types";
import cn from "classnames";
import { InsHTMLAttributes } from "react";

type SpanExtraColor = "gold" | "green" | "orange";

interface SpanProps extends InsHTMLAttributes<HTMLSpanElement> {
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
