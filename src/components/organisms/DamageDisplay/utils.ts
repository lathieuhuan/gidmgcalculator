import { findDataCharacter } from "@Data/controllers";
import { NORMAL_ATTACKS, TRANSFORMATIVE_REACTIONS } from "@Src/constants";

type AttackPatternKey = {
  main: "NAs" | "ES" | "EB";
  subs: string[];
};

type ReactionKey = {
  main: "RXN";
  subs: Array<typeof TRANSFORMATIVE_REACTIONS[number]>;
};

export type TableKey = AttackPatternKey | ReactionKey;

export function getTableKeys(charName: string) {
  const charData = findDataCharacter({ name: charName });
  if (!charData) {
    return [];
  }
  const NAs: AttackPatternKey = {
    main: "NAs",
    subs: [],
  };
  for (const na of NORMAL_ATTACKS) {
    NAs.subs = NAs.subs.concat(charData.activeTalents[na].stats.map(({ name }) => name));
  }

  const result: TableKey[] = [NAs];

  for (const attPatt of ["ES", "EB"] as const) {
    const { stats } = charData.activeTalents[attPatt];
    result.push({
      main: attPatt,
      subs: stats.map(({ name }) => name),
    });
  }

  result.push({
    main: "RXN" as const,
    subs: [...TRANSFORMATIVE_REACTIONS],
  });

  return result;
}

export function displayValue(value: number | number[]) {
  if (value === 0) {
    return "-";
  }
  return Array.isArray(value) ? value.map((v) => Math.round(v)).join(" + ") : Math.round(value);
}
