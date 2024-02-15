import clsx, { ClassValue } from "clsx";
import { FaEraser } from "react-icons/fa";
import type { ArtifactType, CalcArtifact } from "@Src/types";
import type { ArtifactFilterState } from "./types";

// Hook
import { useScreenWatcher } from "@Src/features";
import { useArtifactTypeSelect } from "@Src/hooks";
import { useTabs } from "@Src/pure-hooks";
import { useArtifactSetFilter, useArtifactStatFilter, DEFAULT_STAT_FILTER_CONDITION } from "./hooks";

import { filterArtifacts } from "./filterArtifacts";
import { Button, Modal } from "@Src/pure-components";

export interface ArtifactFilterProps {
  artifactType?: ArtifactType;
  artifacts: CalcArtifact[];
  initialCondition: ArtifactFilterState;
  showTypeFilter?: boolean;
  onConfirm: (filterCondition: ArtifactFilterState) => void;
  onClose: () => void;
}

/**
 * 2 case:
 * type act as a filter category => multiple type select, useArtifactStatFilter & useArtifactSetFilter do not depend on type
 * type act as filter config => single type select, when type change need to reset stats and recalculate sets
 */

const ArtifactFilter = ({
  artifactType,
  artifacts,
  initialCondition,
  showTypeFilter,
  onConfirm,
  onClose,
}: ArtifactFilterProps) => {
  const screenWatcher = useScreenWatcher();
  const { activeIndex, tabsElmt } = useTabs({
    level: 2,
    configs: [{ text: "Stats" }, { text: "Sets" }].concat(showTypeFilter ? [{ text: "Types" }] : []),
  });

  const { artifactTypes, updateArtifactTypes, renderArtifactTypeSelect } = useArtifactTypeSelect(
    initialCondition.types,
    {
      size: "large",
      multiple: true,
    }
  );
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
      types: artifactTypes,
    });
    onClose();
  };

  const isSmallScreen = !screenWatcher.isFromSize("md");

  const wrapperCls = (isHidden: boolean): ClassValue => {
    return isSmallScreen && ["h-full", isHidden && "hidden"];
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 md:hidden">{tabsElmt}</div>

      <div className={clsx("grow overflow-hidden", !isSmallScreen && "xm:px-4 flex space-x-4")}>
        {showTypeFilter ? (
          <div
            className={clsx([
              wrapperCls(activeIndex !== 2),
              "flex flex-col",
              isSmallScreen ? "justify-between" : "mr-4 items-center shrink-0",
            ])}
          >
            {renderArtifactTypeSelect(["mb-6 hide-scrollbar", isSmallScreen ? "justify-center py-4" : "py-2 flex-col"])}

            <div className="flex">
              <Button
                size={isSmallScreen ? "small" : "custom"}
                className={!isSmallScreen && "p-1"}
                icon={<FaEraser className="text-lg" />}
                disabled={!artifactTypes.length}
                onClick={() => updateArtifactTypes([])}
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
            "grid grid-cols-4 sm:grid-cols-6 md:grid-cols-4 xm:grid-cols-6 lg:grid-cols-8"
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
