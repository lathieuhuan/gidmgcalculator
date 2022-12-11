import { useState } from "react";
import type { Artifact, CalcArtifact } from "@Src/types";

import { useArtifactSetFilter, useArtifactStatsFilter } from "../hooks";
import { hasDupStat, initArtifactStatsFilter, StatsFilter } from "../utils";

import { ButtonBar } from "@Components/minors";
import { CollapseAndMount } from "@Components/collapse";
import { Button } from "@Src/styled-components";

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
  artifacts: CalcArtifact[];
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

  const {
    filter: artifactStatsFilter,
    setFilter: setArtifactStatsFilter,
    renderArtifactStatsFilter,
  } = useArtifactStatsFilter({
    artifactType,
    stats: filter.stats,
    isError,
  });

  const { filteredTempCodes, renderArtifactSetFilter } = useArtifactSetFilter({
    artifactType,
    artifacts,
    codes: filter.codes,
  });
  const disabled =
    artifactStatsFilter.main === "All" && artifactStatsFilter.subs.every((s) => s === "All");

  return (
    <div className="p-4 flex hide-scrollbar">
      <div className="flex flex-col">
        <Button
          className="mb-2 mx-auto"
          disabled={disabled}
          onClick={() => setArtifactStatsFilter(initArtifactStatsFilter())}
        >
          Reset Stats
        </Button>

        {renderArtifactStatsFilter()}

        <ButtonBar
          className="mt-4 pb-2"
          texts={["Cancel", "Confirm"]}
          handlers={[
            onClose,
            () => {
              if (hasDupStat(artifactStatsFilter)) {
                setIsError(true);
                return;
              }

              filter.setStats(artifactStatsFilter);
              filter.setCodes(filteredTempCodes);
              onClose();
            },
          ]}
        />
      </div>

      {renderArtifactSetFilter()}
    </div>
  );
}
