import cn from "classnames";
import type { HTMLAttributes } from "react";
import type { Vision } from "@Src/types";
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
  checked?: boolean;
  heading: ReactNode;
  desc: ReactNode;
  setters?: JSX.Element | JSX.Element[] | null;
  onToggle?: () => void;
}
export function ModifierTemplate({
  mutable = true,
  checked,
  heading,
  desc,
  setters,
  onToggle,
}: ModifierLayoutProps) {
  return (
    <div>
      <div className="mb-1 flex">
        <label className="flex items-center">
          {mutable && (
            <input
              type="checkbox"
              className="ml-1 mr-2 scale-150"
              checked={checked}
              onChange={onToggle}
            />
          )}
          <span className="pl-1 font-bold text-lightgold">
            {mutable ? "" : "+"} {heading}
          </span>
        </label>
      </div>
      <p>{desc}</p>
      {setters && (
        <div className={cn("flex flex-col", mutable ? "pt-2 pb-1 pr-1 space-y-3" : "space-y-2")}>
          {setters}
        </div>
      )}
    </div>
  );
}
