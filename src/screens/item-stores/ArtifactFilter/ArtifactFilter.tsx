import { useState } from "react";
import type { Artifact, CalcArtPiece } from "@Src/types";

import useArtSetFilter from "../hooks/useArtifactSetFilter";
import useArtStatsFilter from "../hooks/useArtifactStatsFilter";
import { hasDupStat, initArtifactStatsFilter, StatsFilter } from "../utils";

import { ButtonBar } from "@Components/minors";
import { CollapseAndMount } from "@Components/Collapse";

interface ArtifactFilterProps extends FilterProps {
  filterOn: boolean;
}
export function ArtifactFilter({ filterOn, ...rest }: ArtifactFilterProps) {
  return (
    <CollapseAndMount
      className="absolute top-full left-0 z-20 w-full rounded-b-lg shadow-common bg-darkblue-3 flex justify-center"
      active={filterOn}
      activeHeight="28.35rem"
      duration={150}
    >
      <Filter {...rest} />
    </CollapseAndMount>
  );
}

interface FilterProps {
  artifactType: Artifact;
  artifacts: CalcArtPiece[];
  filter: {
    stats: StatsFilter;
    codes: number[];
    setStats: (newStats: StatsFilter) => void;
    setCodes: (newCodes: number[]) => void;
  };
  onClose: () => void;
}
function Filter({ artifactType, artifacts, filter, onClose }: FilterProps) {
  const [isError, setIsError] = useState(false);
  const [statsFilter, stats, setStats] = useArtStatsFilter({
    artifactType,
    stats: filter.stats,
    isError,
  });
  const [setFilter, codes] = useArtSetFilter({
    artifactType,
    artifacts,
    codes: filter.codes,
  });
  const resetable = stats.main !== "All" || stats.subs.some((s) => s !== "All");

  return (
    <div className="p-4 flex hide-sb">
      <div className="flex-col">
        <ButtonBar
          className="mb-2"
          texts={["Reset Stats"]}
          availables={[resetable]}
          handlers={[() => filter.setStats(initArtifactStatsFilter())]}
        />
        {statsFilter}
        <ButtonBar
          className="mt-4 pb-2"
          texts={["Cancel", "Confirm"]}
          handlers={[
            onClose,
            () => {
              if (hasDupStat(stats)) {
                setIsError(true);
                return;
              }
              filter.setStats(stats);
              filter.setCodes(codes);
              onClose();
            },
          ]}
        />
      </div>
      {setFilter}
    </div>
  );
}
