import { useState } from "react";
import type { AttributeStat } from "@Src/types";

type FilterOption = "All" | AttributeStat;

interface StatsFilter {
  main: FilterOption;
  subs: FilterOption[];
}

const DEFAULT_FILTER: StatsFilter = {
  main: "All",
  subs: Array(4).fill("All"),
};

export function useArtifactStatsFilter(initialFilter: StatsFilter) {
  const [filter, setFilter] = useState(initialFilter);
  const [hasDuplicates, setHasDuplicates] = useState(false);

  const checkDuplicate = (filter: StatsFilter) => {
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
    const newFilter: StatsFilter = {
      main: newStat as FilterOption,
      subs: filter.subs,
    };

    if (hasDuplicates !== checkDuplicate(newFilter)) {
      setHasDuplicates(!hasDuplicates);
    }

    setFilter(newFilter);
  };

  const changeSubStat = (newStat: string, index: number) => {
    const newSubs = [...filter.subs];
    newSubs[index] = newStat as FilterOption;

    if (newStat === "All") {
      for (let k = index; k < 4; k++) {
        newSubs[k] = "All";
      }
    }
    const newFilter: StatsFilter = {
      main: filter.main,
      subs: newSubs,
    };

    if (hasDuplicates !== checkDuplicate(newFilter)) {
      setHasDuplicates(!hasDuplicates);
    }

    setFilter(newFilter);
  };

  const clearFilter = () => {
    setFilter(DEFAULT_FILTER);
    setHasDuplicates(false);
  };

  return {
    filter,
    hasDuplicates,
    changeMainStat,
    changeSubStat,
    clearFilter,
    setFilter,
  };
}
