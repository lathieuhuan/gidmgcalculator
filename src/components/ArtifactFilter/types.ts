import { ArtifactType, AttributeStat } from "@Src/types";

export type ArtifactFilterSet = {
  code: number;
  chosen: boolean;
  icon: string;
};

export type ArtifactStatFilterOption = "All" | AttributeStat;

export interface ArtifactStatFilterCondition {
  main: ArtifactStatFilterOption;
  subs: ArtifactStatFilterOption[];
}

export type ArtifactFilterCondition = {
  stats: ArtifactStatFilterCondition;
  codes: number[];
  types: ArtifactType[];
};
