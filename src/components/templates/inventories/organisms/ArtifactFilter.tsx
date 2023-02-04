import { useState } from "react";
import type { ArtifactType, CalcArtifact } from "@Src/types";

// Hook
import { useArtifactSetFilter, useArtifactStatsFilter } from "../hooks";

// Util
import { hasDupStat, initArtifactStatsFilter, StatsFilter } from "../utils";

// Component
import { Button, CollapseAndMount } from "@Components/atoms";
import { ButtonBar } from "@Components/molecules";

interface ArtifactFilterProps {
  artifactType: ArtifactType;
  artifacts: CalcArtifact[];
  filter: {
    stats: StatsFilter;
    codes: number[];
    setStats: (newStats: StatsFilter) => void;
    setCodes: (newCodes: number[]) => void;
  };
  onClose: () => void;
}
const ArtifactFilterCore = ({ artifactType, artifacts, filter, onClose }: ArtifactFilterProps) => {
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
          buttons={[
            { text: "Cancel", onClick: onClose },
            {
              text: "Confirm",
              onClick: () => {
                if (hasDupStat(artifactStatsFilter)) {
                  setIsError(true);
                  return;
                }

                filter.setStats(artifactStatsFilter);
                filter.setCodes(filteredTempCodes);
                onClose();
              },
            },
          ]}
        />
      </div>

      {renderArtifactSetFilter()}
    </div>
  );
};

export const ArtifactFilter = ({
  active,
  ...rest
}: ArtifactFilterProps & {
  active: boolean;
}) => {
  return (
    <CollapseAndMount
      className="absolute top-full left-0 z-20 w-full rounded-b-lg shadow-common bg-darkblue-3 flex justify-center"
      active={active}
      activeHeight="28.35rem"
      duration={150}
    >
      <ArtifactFilterCore {...rest} />
    </CollapseAndMount>
  );
};
