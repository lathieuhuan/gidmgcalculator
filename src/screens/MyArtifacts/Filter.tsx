import { useEffect, useState } from "react";
import type { ArtifactType } from "@Src/types";
import type { StatsFilter } from "@Components/item-stores/utils";

// Hook
import { useSelector } from "@Store/hooks";
import {
  useArtifactSetFilter,
  useArtifactStatsFilter,
  useTypeFilter,
} from "@Components/item-stores/hooks";

// Selector
import { selectMyArts } from "@Store/userDatabaseSlice/selectors";

// Util
import { hasDupStat } from "@Components/item-stores/utils";

// Component
import { ButtonBar } from "@Src/styled-components";
import { Modal, ModalControl } from "@Components/modals";

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
  const myArts = useSelector(selectMyArts);

  const { filteredTypes, renderTypeFilter } = useTypeFilter({
    itemType: "artifact",
    initialTypes: types,
  });
  const { filter: artifactStatsFilter, renderArtifactStatsFilter } = useArtifactStatsFilter({
    stats,
    isError,
  });
  const { filteredTempCodes, renderArtifactSetFilter } = useArtifactSetFilter({
    artifacts: myArts,
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

      <ButtonBar
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
    <Modal active={active} className="max-w-95" onClose={onClose}>
      <FilterInner {...rest} onClose={onClose} />
    </Modal>
  );
}
