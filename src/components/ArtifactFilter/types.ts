import { ArtifactType, AttributeStat } from "@Src/types";

export type ArtifactFilterSet = {
  code: number;
  chosen: boolean;
  icon: string;
};

export type ArtifactStatFilterOption = "All" | AttributeStat;

export interface ArtifactStatFilterState {
  main: ArtifactStatFilterOption;
  subs: ArtifactStatFilterOption[];
}

export type ArtifactFilterState = {
  stats: ArtifactStatFilterState;
  codes: number[];
  types: ArtifactType[];
};
