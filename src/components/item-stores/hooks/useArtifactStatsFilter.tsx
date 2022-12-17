import clsx from "clsx";
import { ChangeEventHandler, useState } from "react";
import { FaInfo, FaTimes } from "react-icons/fa";
import type { ArtifactType, ArtifactMainStatType, ArtifactSubStatType } from "@Src/types";
import type { StatsFilter } from "../utils";

// Constant
import { ARTIFACT_MAIN_STATS } from "@Data/artifacts/constants";
import { ARTIFACT_PERCENT_STAT_TYPES, ATTACK_ELEMENTS, CORE_STAT_TYPES } from "@Src/constants";

// Hook
import { useTranslation } from "@Hooks/useTranslation";

// Component
import { Select } from "@Src/styled-components";
import { Green, IconButton } from "@Components/atoms";

const MAIN_STAT_TYPES = [
  "hp",
  "atk",
  ...ARTIFACT_PERCENT_STAT_TYPES,
  "em",
  ...ATTACK_ELEMENTS,
  "healBn",
];

interface UseArtifactStatsFilterArgs {
  artifactType?: ArtifactType;
  stats: StatsFilter;
  isError: boolean;
}
export function useArtifactStatsFilter({
  artifactType,
  stats,
  isError,
}: UseArtifactStatsFilterArgs) {
  const { t } = useTranslation();

  const [filter, setFilter] = useState(stats);
  const [atInfo, setAtInfo] = useState(false);

  const Icon = atInfo ? FaTimes : FaInfo;

  const mainStatOptions = artifactType
    ? ["All", ...Object.keys(ARTIFACT_MAIN_STATS[artifactType])]
    : ["All", ...MAIN_STAT_TYPES];

  const subStatOptions = ["All", ...CORE_STAT_TYPES, ...ARTIFACT_PERCENT_STAT_TYPES, "em"];

  const onChangeMainStat: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setFilter((prev) => ({ ...prev, main: e.target.value as "All" | ArtifactMainStatType }));
  };

  const onChangeSubStat = (newStat: string, index: number) => {
    setFilter((prev) => {
      const newSubs = [...prev.subs];
      newSubs[index] = newStat as "All" | ArtifactSubStatType;

      if (newStat === "All") {
        for (let k = index; k < 4; k++) {
          newSubs[k] = "All";
        }
      }
      return { ...prev, subs: newSubs };
    });
  };

  const workMode = (
    <div className="h-full flex flex-col">
      <p className="mt-2 text-lg text-orange font-bold">Main Stat</p>
      <div className="mt-1 flex justify-center">
        <div className="w-52 px-4 bg-darkblue-1">
          <Select
            className={clsx(
              "w-full p-1 text-center text-last-center",
              filter.main === "All" ? "text-default" : "text-green"
            )}
            value={filter.main}
            onChange={onChangeMainStat}
          >
            {mainStatOptions.map((type, i) => (
              <option key={i} className="text-left" value={type}>
                {t(type)}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <p className="mt-2 text-lg text-orange font-bold">Sub Stats</p>
      <div className="flex flex-col items-center">
        {[1, 2, 3, 4].map((n, i) => {
          return (
            <div key={n} className="mt-2 px-4 w-52 h-8 bg-darkblue-1 flex items-center">
              <p className="mr-1 mt-1 text-orange">{n}</p>

              {(!i || filter.subs[i - 1] !== "All") && (
                <Select
                  className={clsx(
                    "w-full p-1 text-center text-last-center",
                    filter.subs[i] === "All" ? "text-default" : "text-green"
                  )}
                  value={filter.subs[i]}
                  onChange={(e) => onChangeSubStat(e.target.value, i)}
                >
                  {subStatOptions.map((type, j) => (
                    <option key={j} className="text-left" value={type}>
                      {t(type)}
                    </option>
                  ))}
                </Select>
              )}
            </div>
          );
        })}
      </div>
      {isError && <p className="mt-4 px-2 text-lightred text-right">Every stat must be unique!</p>}
    </div>
  );

  const renderArtifactStatsFilter = () => (
    <div className="mr-2 px-4 py-2 h-full w-72 rounded-lg bg-darkblue-2 relative">
      <IconButton
        className="text-sm absolute bottom-3 left-3"
        variant={atInfo ? "negative" : "default"}
        size="w-6 h-6"
        onClick={() => setAtInfo(!atInfo)}
      >
        <Icon />
      </IconButton>

      {atInfo ? (
        <div className="mt-2">
          <p>
            Artifacts will not only be <Green>filtered</Green> by stats, but also be{" "}
            <Green>sorted</Green> by stats. The priority is Main Stat (if it's not "All"), then Sub
            Stat 1, Sub Stat 2...
          </p>
        </div>
      ) : (
        workMode
      )}
    </div>
  );

  return {
    filter,
    setFilter,
    renderArtifactStatsFilter,
  };
}
