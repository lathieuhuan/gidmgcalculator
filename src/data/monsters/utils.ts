import type { Target, TargetResistance } from "@Src/types";

export function applyVariant(target: Target, variant: string | undefined, value: number) {
  if (variant) {
    const resistanceKey = `${variant}_res` as TargetResistance;
    target[resistanceKey] += value;
  }
};

type ByVariantArgs = {
  target: Target;
  variant?: string;
};
export function byVariant(value: number) {
  return ({ target, variant }: ByVariantArgs) => {
    applyVariant(target, variant, value);
  };
}

export function changeAllResistances(target: Target, value: number) {
  for (const type in target) {
    if (type.slice(-3) === "res") {
      target[type as TargetResistance] += value;
    }
  }
}