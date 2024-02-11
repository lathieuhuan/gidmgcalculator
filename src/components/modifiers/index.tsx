import type { AmplifyingReaction, QuickenReaction, ElementType } from "@Src/types";
import { Green } from "@Src/pure-components";
import { round } from "@Src/utils";

export * from "./renderWeaponModifiers";
export * from "./renderArtifactModifiers";

export const renderModifiers = (modifiers: (JSX.Element | null)[], type: "buffs" | "debuffs", mutable?: boolean) => {
  return modifiers.some((modifier) => modifier !== null) ? (
    <div className={mutable ? "pt-2 space-y-3" : "space-y-2"}>{modifiers}</div>
  ) : (
    <p className="pt-6 pb-4 text-center">No {type} found</p>
  );
};

export const renderVapMeltHeading = (element: ElementType, reaction: AmplifyingReaction) => (
  <>
    <span className="capitalize">{reaction}</span>{" "}
    <span className="text-light-800 font-normal">
      (vs {element === "pyro" ? (reaction === "melt" ? "Cryo" : "Hydro") : "Pyro"})
    </span>
  </>
);

export const renderVapMeltDescription = (element: ElementType, mult: number) => (
  <>
    Increases <span className={`text-${element} capitalize`}>{element} DMG</span> by <Green b>{round(mult, 3)}</Green>{" "}
    times.
  </>
);

export const renderQuickenHeading = (element: ElementType, reaction: QuickenReaction) => (
  <>
    <span className="capitalize">{reaction}</span>{" "}
    <span className="text-light-800 font-normal">({element === "electro" ? "Electro" : "Dendro"} on Quicken)</span>
  </>
);

export const renderQuickenDescription = (element: ElementType, value: number) => (
  <>
    Increase base <span className={`text-${element} capitalize`}>{element} DMG</span> by <Green b>{value}</Green>.
  </>
);
