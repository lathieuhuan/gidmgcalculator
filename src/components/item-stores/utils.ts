import type { ArtifactMainStat, ArtifactSubStat, UserArtifact } from "@Src/types";
import { ARTIFACT_MAIN_STATS } from "@Data/artifacts/constants";

export interface StatsFilter {
  main: "All" | ArtifactMainStat;
  subs: ("All" | ArtifactSubStat)[];
}

export function initArtifactStatsFilter(): StatsFilter {
  return {
    main: "All",
    subs: Array(4).fill("All"),
  };
}

export function filterArtIdsBySetsAndStats(
  artifacts: UserArtifact[],
  setCodes: number[],
  stats: StatsFilter
) {
  let result = setCodes.length
    ? artifacts.filter((p) => setCodes.includes(p.code))
    : [...artifacts];

  function compareMainStat(a: UserArtifact, b: UserArtifact) {
    const mainStatValue = (p: UserArtifact) => {
      return ARTIFACT_MAIN_STATS[p.type][p.mainStatType]?.[p.rarity || 5][p.level] || 0;
    };
    return mainStatValue(b) - mainStatValue(a);
  }

  if (stats.main !== "All") {
    result = result.filter((p) => p.mainStatType === stats.main);
    if (stats.subs[0] === "All") {
      result.sort(compareMainStat);
    }
  }

  if (stats.subs[0] !== "All") {
    const requires = stats.subs.filter((s) => s !== "All") as ArtifactSubStat[];

    result = result.filter((p) =>
      requires.every((rq) => p.subStats.map((ss) => ss.type).includes(rq))
    );

    const getValue = (artifact: UserArtifact, type: ArtifactSubStat) => {
      return artifact.subStats.find((stat) => stat.type === type)?.value || 0;
    };

    result.sort((a, b) => {
      if (stats.main !== "All") {
        const msResult = compareMainStat(a, b);
        if (msResult) return msResult;
      }
      for (const rq of requires) {
        const ssResult = getValue(b, rq) - getValue(a, rq);
        if (ssResult) return ssResult;
      }
      return 0;
    });
  }
  return result.map(({ ID }) => ID);
}

export function hasDupStat(stats: StatsFilter) {
  const existed: string[] = [stats.main];

  for (let ss of stats.subs) {
    if (ss === "All") {
      continue;
    }
    if (existed.includes(ss)) {
      return true;
    } else {
      existed.push(ss);
    }
  }
  return false;
}
