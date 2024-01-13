import { useState } from "react";

import type { ArtifactType, CalcArtifact } from "@Src/types";
import { findByCode } from "@Src/utils";
import { $AppData } from "@Src/services";

export type FilterSet = {
  code: number;
  chosen: boolean;
  icon: string;
};

const getDefaultFilterSets = (artifactType: ArtifactType, artifacts: CalcArtifact[], chosenCodes: number[]) => {
  const result: FilterSet[] = [];

  for (const { code } of artifacts) {
    if (!findByCode(result, code)) {
      const { icon = "" } = $AppData.getArtifactData({ code, type: artifactType }) || {};

      result.push({
        code,
        chosen: chosenCodes.includes(code),
        icon,
      });
    }
  }
  return result;
};

interface UseArtifactSetFilterArgs {
  artifactType?: ArtifactType;
  artifacts: CalcArtifact[];
  initialChosenCodes: number[];
}
export function useArtifactSetFilter({
  artifactType = "flower",
  artifacts,
  initialChosenCodes,
}: UseArtifactSetFilterArgs) {
  //
  const [sets, setSets] = useState<FilterSet[]>(getDefaultFilterSets(artifactType, artifacts, initialChosenCodes));

  const filteredCodes = sets.reduce((codes: number[], tempSet) => {
    if (tempSet.chosen) {
      codes.push(tempSet.code);
    }
    return codes;
  }, []);

  const toggleSet = (index: number) => {
    setSets((prev) => {
      const result = [...prev];
      result[index].chosen = !result[index].chosen;
      return result;
    });
  };

  const clearFilter = () => {
    setSets(sets.map((set) => ({ ...set, chosen: false })));
  };

  return {
    filterSets: sets,
    toggleSet,
    clearFilter,
  };
}
