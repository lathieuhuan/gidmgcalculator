import { useEffect, useState } from "react";
import type { Artifact } from "@Src/types";

import { useSelector } from "@Store/hooks";
import useArtSetFilter from "@Components/item-stores/hooks/useArtifactSetFilter";
import useArtStatsFilter from "@Components/item-stores/hooks/useArtifactStatsFilter";
import useTypeFilter from "@Components/item-stores/hooks/useTypeFilter";

import { selectMyArts } from "@Store/usersDatabaseSlice/selectors";
import { hasDupStat, StatsFilter } from "@Components/item-stores/utils";

import { ButtonBar } from "@Components/minors";
import { Modal } from "@Components/modals";

interface FilterProps {
  types: Artifact[];
  codes: number[];
  stats: StatsFilter;
  setTypes: (newTypes: Artifact[]) => void;
  setCodes: (newCodes: number[]) => void;
  setStats: (newStats: StatsFilter) => void;
  onClose: () => void;
}
export function Filter({
  types,
  codes,
  stats,
  setTypes,
  setCodes,
  setStats,
  onClose,
}: FilterProps) {
  const [isError, setIsError] = useState(false);
  const myArts = useSelector(selectMyArts);

  const [typeFilter, tempTypes] = useTypeFilter(false, types);
  const [statsFilter, tempStats] = useArtStatsFilter({ stats, isError });
  const [setsFilter, tempCodes] = useArtSetFilter({ artifacts: myArts, codes });

  useEffect(() => setIsError(false), [stats]);

  return (
    <Modal onClose={onClose}>
      <div className="p-4 rounded-lg bg-darkblue-3 shadow-white-glow max-width-95">
        <div className="pb-2 flex custom-scrollbar">
          <div className="flex flex-col">
            <div className="pt-2 pb-4 flex justify-center">{typeFilter}</div>
            {statsFilter}
          </div>
          {setsFilter}
        </div>

        <ButtonBar
          className="mt-4"
          texts={["Cancel", "Confirm"]}
          handlers={[
            onClose,
            () => {
              if (hasDupStat(tempStats)) {
                setIsError(true);
                return;
              }
              setTypes(tempTypes as Artifact[]);
              setCodes(tempCodes);
              setStats(tempStats);
              onClose();
            },
          ]}
        />
      </div>
    </Modal>
  );
}
