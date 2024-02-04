import clsx, { ClassValue } from "clsx";
import { BiReset } from "react-icons/bi";
import type { ArtifactType, CalcArtifact } from "@Src/types";
import type { ArtifactFilterCondition } from "./types";

// Hook
import { useScreenSize } from "@Src/features";
import { useTypeFilter } from "@Src/hooks";
import { useTabs } from "@Src/pure-hooks";
import { useArtifactSetFilter, useArtifactStatFilter, DEFAULT_STAT_FILTER_CONDITION } from "./hooks";

import { filterArtifacts } from "./filterArtifacts";
import { Button, Modal } from "@Src/pure-components";

export interface ArtifactFilterProps {
  artifactType?: ArtifactType;
  artifacts: CalcArtifact[];
  initialCondition: ArtifactFilterCondition;
  showTypeFilter?: boolean;
  onConfirm: (filterCondition: ArtifactFilterCondition) => void;
  onClose: () => void;
}

const ArtifactFilter = ({
  artifactType,
  artifacts,
  initialCondition,
  showTypeFilter,
  onConfirm,
  onClose,
}: ArtifactFilterProps) => {
  const screenSize = useScreenSize();
  const { activeIndex, tabsElmt } = useTabs({
    level: 2,
    configs: [{ text: "Stats" }, { text: "Sets" }].concat(showTypeFilter ? [{ text: "Types" }] : []),
  });

  const { filteredTypes, operate, renderTypeFilter } = useTypeFilter("artifact", initialCondition.types);
  const { statsFilter, hasDuplicates, renderArtifactStatFilter } = useArtifactStatFilter(
    initialCondition.stats,
    artifactType
  );
  const { filterSets, renderArtifactSetFilter } = useArtifactSetFilter(artifacts, initialCondition.codes, artifactType);

  const onConfirmFilter = () => {
    const filteredCodes = filterSets.reduce((codes: number[], tempSet) => {
      if (tempSet.chosen) {
        codes.push(tempSet.code);
      }
      return codes;
    }, []);

    onConfirm({
      stats: statsFilter,
      codes: filteredCodes,
      types: filteredTypes as ArtifactType[],
    });
    onClose();
  };

  const isSmallScreen = ["xs", "sm"].includes(screenSize);

  const wrapperCls = (isHidden: boolean): ClassValue => {
    return isSmallScreen && ["h-full", isHidden && "hidden"];
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 md1:hidden">{tabsElmt}</div>

      <div className={clsx("grow overflow-hidden", !isSmallScreen && "md2:px-4 flex space-x-4")}>
        {showTypeFilter ? (
          <div
            className={clsx([
              wrapperCls(activeIndex !== 2),
              "flex flex-col",
              isSmallScreen ? "justify-between" : "mr-4 items-center shrink-0",
            ])}
          >
            {renderTypeFilter(["mb-6 hide-scrollbar", isSmallScreen ? "justify-center py-4" : "py-2 flex-col"])}

            <div className="flex">
              <Button
                size={isSmallScreen ? "small" : "custom"}
                className={!isSmallScreen && "p-1"}
                icon={<BiReset className="text-lg" />}
                disabled={!filteredTypes.length}
                onClick={() => operate.updateFilter([])}
              >
                {isSmallScreen ? "Clear all" : ""}
              </Button>
            </div>
          </div>
        ) : null}

        <div className={clsx(wrapperCls(activeIndex !== 0), "shrink-0", !isSmallScreen && "w-56")}>
          {renderArtifactStatFilter()}
        </div>

        <div className={clsx([wrapperCls(activeIndex !== 1), "grow"])}>
          {renderArtifactSetFilter(
            null,
            clsx("grid", isSmallScreen ? "grid-cols-4" : "grid-cols-3 md2:grid-cols-4 lg:grid-cols-6")
          )}
        </div>
      </div>

      <Modal.Actions disabledConfirm={hasDuplicates} onCancel={onClose} onConfirm={onConfirmFilter} />
    </div>
  );
};

ArtifactFilter.DEFAULT_CONDITION = {
  stats: DEFAULT_STAT_FILTER_CONDITION,
  codes: [],
  types: [],
};
ArtifactFilter.filterArtifacts = filterArtifacts;

export { ArtifactFilter };
