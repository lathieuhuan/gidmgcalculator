import clsx, { ClassValue } from "clsx";
import { useState } from "react";

import type { ArtifactType } from "@Src/types";
import type { ArtifactStatFilterState, ArtifactStatFilterOption } from "../types";
import { ARTIFACT_SUBSTAT_TYPES, ATTACK_ELEMENTS } from "@Src/constants";
import { ARTIFACT_MAIN_STATS } from "@Src/constants/artifact-stats";
import { useTranslation } from "@Src/pure-hooks";
import { FilterTemplate } from "@Src/pure-components";

type RenderSelectArgs = {
  no?: number;
  value: string;
  options: string[];
  showSelect?: boolean;
  onChange: (value: string, no: number) => void;
};

export const DEFAULT_STAT_FILTER: ArtifactStatFilterState = {
  main: "All",
  subs: Array(4).fill("All"),
};

type Config = {
  artifactType?: ArtifactType;
  title?: React.ReactNode;
};

export const useArtifactStatFilter = (initialFilter: ArtifactStatFilterState, config?: Config) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState(initialFilter);
  const [hasDuplicates, setHasDuplicates] = useState(false);

  const { artifactType, title = "Filter by Stat" } = config || {};

  const mainStatOptions = artifactType
    ? ["All", ...Object.keys(ARTIFACT_MAIN_STATS[artifactType])]
    : ["All", "hp", "hp_", "atk", "atk_", "def_", "em", "er_", "cRate_", "cDmg_", ...ATTACK_ELEMENTS, "healB_"];
  const subStatOptions = ["All"].concat(ARTIFACT_SUBSTAT_TYPES);

  const resetable = filter.main !== "All" || filter.subs.some((s) => s !== "All");

  const checkDuplicate = (filter: ArtifactStatFilterState) => {
    const record: Record<string, boolean> = {
      [filter.main]: true,
    };
    for (const stat of filter.subs) {
      if (stat !== "All" && record[stat]) {
        return true;
      }
      record[stat] = true;
    }
    return false;
  };

  const changeMainStat = (newStat: string) => {
    const newFilter: ArtifactStatFilterState = {
      main: newStat as ArtifactStatFilterOption,
      subs: filter.subs,
    };

    if (hasDuplicates !== checkDuplicate(newFilter)) {
      setHasDuplicates(!hasDuplicates);
    }

    setFilter(newFilter);
  };

  const changeSubStat = (newStat: string, index: number) => {
    const newSubs = [...filter.subs];
    newSubs[index] = newStat as ArtifactStatFilterOption;

    if (newStat === "All") {
      for (let k = index; k < 4; k++) {
        newSubs[k] = "All";
      }
    }
    const newFilter: ArtifactStatFilterState = {
      main: filter.main,
      subs: newSubs,
    };

    if (hasDuplicates !== checkDuplicate(newFilter)) {
      setHasDuplicates(!hasDuplicates);
    }

    setFilter(newFilter);
  };

  const clearFilter = () => {
    setFilter(DEFAULT_STAT_FILTER);
    setHasDuplicates(false);
  };

  const renderSelect = ({ no = 0, value, options, showSelect = true, onChange }: RenderSelectArgs) => {
    return (
      <div key={no} className="px-4 w-56 h-8 bg-dark-500 flex items-center">
        <div className="mr-1 pt-0.5 w-2.5 text-base text-light-400 shrink-0">{no ? <p>{no}.</p> : null}</div>
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

  const renderArtifactStatFilter = (className?: ClassValue) => {
    return (
      <FilterTemplate
        className={className}
        title={title}
        description={
          <p className="text-sm text-light-600">
            Also sort by stats. The priority is Main Stat (if not "All"), then Sub Stat 1, Sub Stat 2, and so on.
          </p>
        }
        disabledClearAll={!resetable}
        onClickClearAll={clearFilter}
      >
        <div className="space-y-1">
          <p className="text-lg text-blue-400 font-semibold">Main Stat</p>
          <div className="mt-1 flex justify-center">
            {renderSelect({ value: filter.main, options: mainStatOptions, onChange: changeMainStat })}
          </div>
        </div>

        <div className="mt-3 space-y-1">
          <p className="text-lg text-blue-400 font-semibold">Sub Stats</p>
          <div className="flex flex-col items-center space-y-2">
            {[1, 2, 3, 4].map((no, i) => {
              const prevValue = filter.subs[i - 1];

              return renderSelect({
                no,
                value: filter.subs[i],
                options: subStatOptions,
                showSelect: !prevValue || prevValue !== "All",
                onChange: changeSubStat,
              });
            })}
          </div>
        </div>

        {hasDuplicates && <p className="mt-4 text-red-100">Every stat must be unique!</p>}
      </FilterTemplate>
    );
  };

  return {
    statsFilter: filter,
    hasDuplicates,
    renderArtifactStatFilter,
  };
};
