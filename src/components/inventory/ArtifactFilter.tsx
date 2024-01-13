import clsx from "clsx";
import type { ArtifactType, CalcArtifact } from "@Src/types";
import { useArtifactSetFilter, useArtifactStatsFilter } from "./hooks";
import { hasDupStat, initArtifactStatsFilter, StatsFilter } from "./utils";
import { useScreenSize } from "@Src/features";

// Component
import { Button } from "@Src/pure-components";
import { useTabs } from "@Src/pure-hooks";
import { ArtifactStatFilter } from "./ArtifactStatFilter";
import { ArtifactSetFilter } from "./ArtifactSetFilter";

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
  const screenSize = useScreenSize();
  const { activeIndex, tabsElmt } = useTabs({
    level: 2,
    configs: [{ text: "Stats" }, { text: "Sets" }],
  });

  const {
    filter: statsFilter,
    hasDuplicates,
    changeMainStat,
    changeSubStat,
    clearFilter: clearStatsFilter,
  } = useArtifactStatsFilter(filter.stats);

  const {
    filterSets,
    toggleSet,
    clearFilter: clearSetFilter,
  } = useArtifactSetFilter({
    artifactType,
    artifacts,
    initialChosenCodes: filter.codes,
  });

  const onConfirmFilter = () => {
    const filteredCodes = filterSets.reduce((codes: number[], tempSet) => {
      if (tempSet.chosen) {
        codes.push(tempSet.code);
      }
      return codes;
    }, []);

    filter.setStats(statsFilter);
    filter.setCodes(filteredCodes);

    onClose();
  };

  const isSmallScreen = ["xs", "sm"].includes(screenSize);
  const wrapperCls = "p-4 rounded-lg bg-dark-700";

  return (
    <div className="w-full p-4 flex flex-col">
      <div className="mb-4 md1:hidden">{tabsElmt}</div>

      <div className={clsx("grow overflow-hidden", !isSmallScreen && "flex space-x-2")}>
        <div className={clsx(isSmallScreen ? activeIndex !== 0 && "hidden" : wrapperCls)}>
          <ArtifactStatFilter
            artifactType={artifactType}
            mainStat={statsFilter.main}
            subStats={statsFilter.subs}
            error={hasDuplicates ? "Every stat must be unique!" : ""}
            onChangeMainStat={changeMainStat}
            onChangeSubStat={changeSubStat}
            onClearFilter={clearStatsFilter}
          />
        </div>

        <div className={clsx(isSmallScreen ? ["h-full", activeIndex !== 1 && "hidden"] : [wrapperCls, "shrink-0"])}>
          <ArtifactSetFilter
            setsWrapCls={clsx("grid", isSmallScreen ? "grid-cols-4" : "grid-cols-3 md2:grid-cols-4 lg:grid-cols-6")}
            filterSets={filterSets}
            onClickSet={toggleSet}
            onClearFilter={clearSetFilter}
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end space-x-2">
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="positive" disabled={hasDuplicates} onClick={onConfirmFilter}>
          Confirm
        </Button>
      </div>
    </div>
  );
};
