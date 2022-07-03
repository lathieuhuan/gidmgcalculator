import type { Element } from "@Src/types";

type SpanExtraColor = "gold" | "green" | "orange";

const makeSpan = (color: `text-${Element | SpanExtraColor}`) => (props: React.InsHTMLAttributes<HTMLSpanElement>) => {
  return <span className={color} {...props} />
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