import clsx, { ClassValue } from "clsx";
import { BiReset } from "react-icons/bi";

import type { ArtifactType } from "@Src/types";
import { ARTIFACT_SUBSTAT_TYPES, ATTACK_ELEMENTS } from "@Src/constants";
import { ARTIFACT_MAIN_STATS } from "@Src/constants/artifact-stats";
import { Button } from "@Src/pure-components";
import { useTranslation } from "@Src/pure-hooks";

type RenderSelectArgs = {
  no?: number;
  value: string;
  options: string[];
  showSelect?: boolean;
  onChange: (value: string, no: number) => void;
};

interface ArtifactStatFilterProps {
  className?: ClassValue;
  artifactType?: ArtifactType;
  mainStat: string;
  subStats: string[];
  error?: string;
  onChangeMainStat: (newStat: string) => void;
  onChangeSubStat: (newState: string, index: number) => void;
  onClearFilter: () => void;
}
export const ArtifactStatFilter = ({
  className,
  artifactType,
  mainStat,
  subStats,
  error,
  onChangeMainStat,
  onChangeSubStat,
  onClearFilter,
}: ArtifactStatFilterProps) => {
  const { t } = useTranslation();

  const mainStatOptions = artifactType
    ? ["All", ...Object.keys(ARTIFACT_MAIN_STATS[artifactType])]
    : ["All", "hp", "hp_", "atk", "atk_", "def_", "em", "er_", "cRate_", "cDmg_", ...ATTACK_ELEMENTS, "healB_"];
  const subStatOptions = ["All"].concat(ARTIFACT_SUBSTAT_TYPES);

  const resetable = mainStat !== "All" || subStats.some((s) => s !== "All");

  const renderSelect = ({ no = 0, value, options, showSelect = true, onChange }: RenderSelectArgs) => {
    return (
      <div key={no} className="px-4 w-56 h-8 bg-dark-900 flex items-center">
        <div className="mr-1 pt-0.5 w-2.5 text-base text-orange-500">{no ? <p>{no}</p> : null}</div>
        {showSelect ? (
          <select
            className={clsx("w-full p-1", value === "All" ? "text-light-400" : "text-green-300")}
            value={value}
            onChange={(e) => onChange(e.target.value, no - 1)}
          >
            {options.map((type, i) => (
              <option key={i} className="text-left" value={type}>
                {t(type)}
              </option>
            ))}
          </select>
        ) : null}
      </div>
    );
  };

  return (
    <div className={clsx("h-full w-full", className)}>
      <p className="text-sm">
        Artifacts will not only be <b>filtered</b> by stats, but also <b>sorted</b> by stats. The priority is Main Stat
        (if not "All"), then Sub Stat 1, Sub Stat 2...
      </p>

      <div className="mt-4 flex justify-end space-x-2">
        <Button size="small" icon={<BiReset className="text-lg" />} disabled={!resetable} onClick={onClearFilter}>
          Clear All
        </Button>
      </div>

      <div className="space-y-2">
        <div className="space-y-1">
          <p className="text-lg text-orange-500 font-semibold">Main Stat</p>
          <div className="mt-1 flex justify-center">
            {renderSelect({ value: mainStat, options: mainStatOptions, onChange: onChangeMainStat })}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-lg text-orange-500 font-semibold">Sub Stats</p>
          <div className="flex flex-col items-center space-y-2">
            {[1, 2, 3, 4].map((no, i) => {
              const prevValue = subStats[i - 1];

              return renderSelect({
                no,
                value: subStats[i],
                options: subStatOptions,
                showSelect: !prevValue || prevValue !== "All",
                onChange: onChangeSubStat,
              });
            })}
          </div>
        </div>

        {error ? <p className="mt-4 text-red-100">{error}</p> : null}
      </div>
    </div>
  );
};
