import cn from "classnames";
import type { HTMLAttributes } from "react";
import type { Vision } from "@Src/types";
import { Checkbox } from "./inputs";
import { ReactNode } from "react";

type SpanExtraColor = "gold" | "lightgold" | "lightred" | "green" | "orange";

interface SpanProps extends HTMLAttributes<HTMLSpanElement> {
  className?: string;
  b?: boolean;
}
const makeSpan = (color: `text-${Vision | SpanExtraColor}`) => {
  return ({ className, b, ...rest }: SpanProps) => (
    <span className={cn(color, b && "font-bold", className)} {...rest} />
  );
};

export const Green = makeSpan("text-green");
export const Red = makeSpan("text-lightred");
export const Lightgold = makeSpan("text-lightgold");
export const Gold = makeSpan("text-gold");
export const Pyro = makeSpan("text-pyro");
export const Hydro = makeSpan("text-hydro");
export const Electro = makeSpan("text-electro");
export const Dendro = makeSpan("text-dendro");
export const Cryo = makeSpan("text-cryo");
export const Anemo = makeSpan("text-anemo");
export const Geo = makeSpan("text-geo");

interface ModifierLayoutProps {
  mutable?: boolean;
  checked: boolean;
  heading: string;
  desc: ReactNode;
  setters?: JSX.Element | JSX.Element[] | null;
  onToggle: () => void;
}
export function ModifierLayout({
  mutable = true,
  checked,
  heading,
  desc,
  setters,
  onToggle,
}: ModifierLayoutProps) {
  return (
    <div className="pt-2">
      <div className="pt-1 mb-1 flex">
        <label className="flex items-center">
          {mutable && <Checkbox className="ml-1 mr-2" checked={checked} onChange={onToggle} />}
          <p className="pl-1 font-bold text-lightgold">{heading}</p>
        </label>
      </div>
      <p>{desc}</p>
      {setters && <div className="pt-2 pr-2 flex flex-col gap-5">{setters}</div>}
    </div>
  );
}
