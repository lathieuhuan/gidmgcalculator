import type { ArtifactType, Target } from "@Src/types";
import { toArray } from "@Src/utils";
import artifacts from "./artifacts";
import monsters from "./monsters";

type HasCode = { code: number };

export const findDataArtifactSet = ({ code }: HasCode) => {
  // no artifact with code 0
  return code ? artifacts.find((artifact) => artifact.code === code) : undefined;
};

export function findDataArtifact({ code, type }: { type: ArtifactType } & HasCode) {
  const targetSet = findDataArtifactSet({ code });

  if (targetSet) {
    const { name, icon } = targetSet[type];
    return { beta: targetSet.beta, name, icon };
  }
  return undefined;
}

export const findMonster = ({ code }: { code: number }) => {
  return monsters.find((monster) => monster.code === code);
};

export const getTargetData = (target: Target) => {
  const dataMonster = findMonster(target);
  let variant = "";
  const statuses: string[] = [];

  if (target.variantType && dataMonster?.variant) {
    for (const type of dataMonster.variant.types) {
      if (typeof type === "string") {
        if (type === target.variantType) {
          variant = target.variantType;
          break;
        }
      } else if (type.value === target.variantType) {
        variant = type.label;
        break;
      }
    }
  }

  if (target.inputs?.length && dataMonster?.inputConfigs) {
    const inputConfigs = toArray(dataMonster.inputConfigs);

    target.inputs.forEach((input, index) => {
      const { label, type = "check", options = [] } = inputConfigs[index] || {};

      switch (type) {
        case "check":
          if (input) {
            statuses.push(label);
          }
          break;
        case "select":
          const option = options[input];
          const selectedLabel = typeof option === "string" ? option : option?.label;

          if (selectedLabel) {
            statuses.push(`${label}: ${selectedLabel}`);
          }
          break;
      }
    });
  }

  return {
    title: dataMonster?.title,
    names: dataMonster?.names,
    variant,
    statuses,
  };
};
