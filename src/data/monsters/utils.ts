import type { Target, Vision } from "@Src/types";

export function applyVariant(target: Target, variant: string | undefined, value: number) {
  if (variant) {
    target[variant as Vision] += value;
  }
}

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
    if (type !== "level") {
      target[type as Vision] += value;
    }
  }
}
