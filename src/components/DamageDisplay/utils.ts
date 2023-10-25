import { appData } from "@Src/data";
import { NORMAL_ATTACKS, TRANSFORMATIVE_REACTIONS } from "@Src/constants";

type AttackPatternKey = {
  main: "NAs" | "ES" | "EB";
  subs: string[];
};

type ReactionKey = {
  main: "RXN";
  subs: Array<(typeof TRANSFORMATIVE_REACTIONS)[number]>;
};

export type TableKey = AttackPatternKey | ReactionKey;

export const getTableKeys = (charName: string) => {
  const charData = appData.getCharData(charName);
  if (!charData) {
    return {
      tableKeys: [],
    };
  }
  const NAs: AttackPatternKey = {
    main: "NAs",
    subs: [],
  };
  for (const na of NORMAL_ATTACKS) {
    NAs.subs = NAs.subs.concat(charData.calcList[na].map(({ name }) => name));
  }

  const result: TableKey[] = [NAs];

  for (const attPatt of ["ES", "EB"] as const) {
    result.push({
      main: attPatt,
      subs: charData.calcList[attPatt].map(({ name }) => name),
    });
  }

  result.push({
    main: "RXN" as const,
    subs: [...TRANSFORMATIVE_REACTIONS],
  });

  return {
    tableKeys: result,
    charData,
  };
};

export const displayValue = (value: number | number[]) => {
  if (value === 0) {
    return "-";
  }
  return Array.isArray(value) ? value.map((v) => Math.round(v)).join(" + ") : Math.round(value);
};
