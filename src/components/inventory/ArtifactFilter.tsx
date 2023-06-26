import { useState } from "react";

import type { ArtifactType, CalcArtifact } from "@Src/types";
import { useArtifactSetFilter, useArtifactStatsFilter } from "./hooks";
import { hasDupStat, initArtifactStatsFilter, StatsFilter } from "./utils";

// Component
import { Button, ButtonGroup } from "../button";

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
export const ArtifactFilter = ({ artifactType, artifacts, filter, onClose }: ArtifactFilterProps) => {
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

  const resetIsDisabled = artifactStatsFilter.main === "All" && artifactStatsFilter.subs.every((s) => s === "All");

  const onConfirmFilter = () => {
    if (hasDupStat(artifactStatsFilter)) {
      setIsError(true);
      return;
    }

    filter.setStats(artifactStatsFilter);
    filter.setCodes(filteredTempCodes);

    onClose();
  };

  return (
    <div className="p-4 hide-scrollbar">
      <div className="flex hide-scrollbar">
        <div className="flex flex-col">
          <Button
            className="mb-2 mx-auto"
            disabled={resetIsDisabled}
            onClick={() => setArtifactStatsFilter(initArtifactStatsFilter())}
          >
            Reset Stats
          </Button>

          {renderArtifactStatsFilter()}

          <ButtonGroup
            className="mt-4 pb-2"
            buttons={[
              { text: "Cancel", onClick: onClose },
              { text: "Confirm", onClick: onConfirmFilter },
            ]}
          />
        </div>

        {renderArtifactSetFilter()}
      </div>
    </div>
  );
};
