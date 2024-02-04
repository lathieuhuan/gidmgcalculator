import clsx, { ClassValue } from "clsx";
import { useState } from "react";
import { BiReset } from "react-icons/bi";

import type { ArtifactType } from "@Src/types";
import type { ArtifactStatFilterCondition, ArtifactStatFilterOption } from "../types";
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

export const DEFAULT_STAT_FILTER_CONDITION: ArtifactStatFilterCondition = {
  main: "All",
  subs: Array(4).fill("All"),
};

export function useArtifactStatFilter(initialFilter: ArtifactStatFilterCondition, artifactType?: ArtifactType) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState(initialFilter);
  const [hasDuplicates, setHasDuplicates] = useState(false);

  const mainStatOptions = artifactType
    ? ["All", ...Object.keys(ARTIFACT_MAIN_STATS[artifactType])]
    : ["All", "hp", "hp_", "atk", "atk_", "def_", "em", "er_", "cRate_", "cDmg_", ...ATTACK_ELEMENTS, "healB_"];
  const subStatOptions = ["All"].concat(ARTIFACT_SUBSTAT_TYPES);

  const resetable = filter.main !== "All" || filter.subs.some((s) => s !== "All");

  const checkDuplicate = (filter: ArtifactStatFilterCondition) => {
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
    const newFilter: ArtifactStatFilterCondition = {
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
    const newFilter: ArtifactStatFilterCondition = {
      main: filter.main,
      subs: newSubs,
    };

    if (hasDuplicates !== checkDuplicate(newFilter)) {
      setHasDuplicates(!hasDuplicates);
    }

    setFilter(newFilter);
  };

  const clearFilter = () => {
    setFilter(DEFAULT_STAT_FILTER_CONDITION);
    setHasDuplicates(false);
  };

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

  const renderArtifactStatFilter = (className: ClassValue = "") => {
    return (
      <div className={clsx("h-full w-full flex flex-col", className)}>
        <div className="grow hide-scrollbar flex flex-col space-y-4">
          <p className="text-sm text-light-600">
            Artifacts will not only be <b>filtered</b> by stats, but also <b>sorted</b> by stats. The priority is Main
            Stat (if not "All"), then Sub Stat 1, Sub Stat 2...
          </p>

          <div>
            <div className="space-y-1">
              <p className="text-lg text-orange-500 font-semibold">Main Stat</p>
              <div className="mt-1 flex justify-center">
                {renderSelect({ value: filter.main, options: mainStatOptions, onChange: changeMainStat })}
              </div>
            </div>

            <div className="mt-3 space-y-1">
              <p className="text-lg text-orange-500 font-semibold">Sub Stats</p>
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
          </div>
        </div>

        <div className="mt-4 flex space-x-2">
          <Button size="small" icon={<BiReset className="text-lg" />} disabled={!resetable} onClick={clearFilter}>
            Clear all
          </Button>
        </div>
      </div>
    );
  };

  return {
    statsFilter: filter,
    resetable,
    hasDuplicates,
    operate: {
      changeMainStat,
      changeSubStat,
      clearFilter,
    },
    renderArtifactStatFilter,
  };
}
