import { ARTIFACT_MAIN_STATS } from "@Data/artifacts/constants";
import { Artifact, CalcArtPieceMainStat, CalcArtPieceSubStat, DatabaseArt } from "@Src/types";

export interface StatsFilter {
  main: "All" | CalcArtPieceMainStat;
  subs: ("All" | CalcArtPieceSubStat)[];
}

export function initArtifactStatFilter(): StatsFilter {
  return {
    main: "All",
    subs: Array(4).fill("All"),
  };
}

export function filterArtIdsBySetsAndStats(
  artifacts: DatabaseArt[],
  sets: number[],
  stats: StatsFilter
) {
  let result = sets.length ? artifacts.filter((p) => sets.includes(p.code)) : [...artifacts];

  function compareMainStat(a: DatabaseArt, b: DatabaseArt) {
    const mainStatValue = (p: DatabaseArt) => {
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
    const requires = stats.subs.filter((s) => s !== "All") as CalcArtPieceSubStat[];

    result = result.filter((p) =>
      requires.every((rq) => p.subStats.map((ss) => ss.type).includes(rq))
    );

    const getValue = (p: DatabaseArt, type: CalcArtPieceSubStat) => {
      return p.subStats.find((s) => s.type === type)?.value || 0;
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
