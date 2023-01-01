import type { AmplifyingReaction, QuickenReaction, Vision } from "@Src/types";
import { Green } from "@Components/atoms";
import { round } from "@Src/utils";

export const renderModifiers = (
  modifiers: JSX.Element[],
  type: "buffs" | "debuffs",
  mutable?: boolean
) => {
  return modifiers.length ? (
    <div className={mutable ? "pt-2 space-y-3" : "space-y-2"}>{modifiers}</div>
  ) : (
    <p className="pt-6 pb-4 text-center">No {type} found</p>
  );
};

export const renderAmpReactionHeading = (element: Vision, reaction: AmplifyingReaction) => (
  <>
    <span className="capitalize">{reaction}</span>{" "}
    <span className="text-lesser font-normal">
      (vs {element === "pyro" ? (reaction === "melt" ? "Cryo" : "Hydro") : "Pyro"})
    </span>
  </>
);

export const renderAmpReactionDesc = (element: Vision, mult: number) => (
  <>
    Increases <span className={`text-${element} capitalize`}>{element} DMG</span> by{" "}
    <Green b>{round(mult, 3)}</Green> times.
  </>
);

export const renderQuickenHeading = (element: Vision, reaction: QuickenReaction) => (
  <>
    <span className="capitalize">{reaction}</span>{" "}
    <span className="text-lesser font-normal">
      ({element === "electro" ? "Electro" : "Dendro"} on Quicken)
    </span>
  </>
);

export const renderQuickenDesc = (element: Vision, value: number) => (
  <>
    Increase base <span className={`text-${element} capitalize`}>{element} DMG</span> by{" "}
    <Green b>{value}</Green>.
  </>
);
