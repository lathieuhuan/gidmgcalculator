import clsx from "clsx";
import type { HTMLAttributes } from "react";
import type { Vision } from "@Src/types";

type SpanExtraColor = "lightgold" | "lightred" | "green" | "orange" | "lesser" | "rose-500";

interface SpanProps extends HTMLAttributes<HTMLSpanElement> {
  className?: string;
  b?: boolean;
}
const makeSpan = (color: `text-${Vision | SpanExtraColor}`) => {
  return ({ className, b, ...rest }: SpanProps) => (
    <span className={clsx(color, b && "font-bold", className)} {...rest} />
  );
};

export const Green = makeSpan("text-green-300");
export const Red = makeSpan("text-red-100");
export const Lightgold = makeSpan("text-yellow-400");
export const Lesser = makeSpan("text-light-800");
export const Rose = makeSpan("text-rose-500");
// export const Pyro = makeSpan("text-pyro");
// export const Hydro = makeSpan("text-hydro");
// export const Electro = makeSpan("text-electro");
// export const Dendro = makeSpan("text-dendro");
// export const Cryo = makeSpan("text-cryo");
// export const Anemo = makeSpan("text-anemo");
// export const Geo = makeSpan("text-geo");
