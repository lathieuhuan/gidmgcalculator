import { useEffect, useState } from "react";

import type { ArtifactType } from "@Src/types";
import { selectUserArts } from "@Store/userDatabaseSlice/selectors";
import { hasDupStat, type StatsFilter } from "@Components/inventory/utils";

// Hook
import { useSelector } from "@Store/hooks";
import { useArtifactSetFilter, useArtifactStatsFilter, useTypeFilter } from "@Components/inventory/hooks";

// Component
import { ButtonGroup, Modal, type ModalControl } from "@Src/components";

interface FilterProps {
  types: ArtifactType[];
  codes: number[];
  stats: StatsFilter;
  setTypes: (newTypes: ArtifactType[]) => void;
  setCodes: (newCodes: number[]) => void;
  setStats: (newStats: StatsFilter) => void;
  onClose: () => void;
}
function FilterInner({ types, codes, stats, setTypes, setCodes, setStats, onClose }: FilterProps) {
  const [isError, setIsError] = useState(false);
  const userArts = useSelector(selectUserArts);

  const { filteredTypes, renderTypeFilter } = useTypeFilter({
    itemType: "artifact",
    initialTypes: types,
  });
  const { filter: artifactStatsFilter, renderArtifactStatsFilter } = useArtifactStatsFilter({
    stats,
    isError,
  });
  const { filteredTempCodes, renderArtifactSetFilter } = useArtifactSetFilter({
    artifacts: userArts,
    codes,
  });

  useEffect(() => setIsError(false), [stats]);

  return (
    <div className="p-4 rounded-lg bg-darkblue-3 shadow-white-glow">
      <div className="pb-2 flex custom-scrollbar">
        <div className="flex flex-col">
          <div className="pt-2 pb-4 flex justify-center">{renderTypeFilter()}</div>
          {renderArtifactStatsFilter()}
        </div>
        {renderArtifactSetFilter()}
      </div>

      <ButtonGroup
        className="mt-4"
        buttons={[
          { text: "Cancel", onClick: onClose },
          {
            text: "Confirm",
            onClick: () => {
              if (hasDupStat(artifactStatsFilter)) {
                setIsError(true);
                return;
              }
              setTypes(filteredTypes as ArtifactType[]);
              setCodes(filteredTempCodes);
              setStats(artifactStatsFilter);
              onClose();
            },
          },
        ]}
      />
    </div>
  );
}

export function Filter({ active, onClose, ...rest }: ModalControl & FilterProps) {
  return (
    <Modal active={active} onClose={onClose}>
      <FilterInner {...rest} onClose={onClose} />
    </Modal>
  );
}
