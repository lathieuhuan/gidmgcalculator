import { $AppData } from "@Src/services";
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
  const appChar = $AppData.getCharacter(charName);
  if (!appChar) {
    return {
      tableKeys: [],
    };
  }
  const NAs: AttackPatternKey = {
    main: "NAs",
    subs: [],
  };
  for (const na of NORMAL_ATTACKS) {
    NAs.subs = NAs.subs.concat(appChar.calcList[na].map(({ name }) => name));
  }

  const result: TableKey[] = [NAs];

  for (const attPatt of ["ES", "EB"] as const) {
    result.push({
      main: attPatt,
      subs: appChar.calcList[attPatt].map(({ name }) => name),
    });
  }

  result.push({
    main: "RXN" as const,
    subs: [...TRANSFORMATIVE_REACTIONS],
  });

  return {
    tableKeys: result,
    appChar,
  };
};

export const displayValue = (value: number | number[]) => {
  if (value === 0) {
    return "-";
  }
  return Array.isArray(value) ? value.map((v) => Math.round(v)).join(" + ") : Math.round(value);
};
