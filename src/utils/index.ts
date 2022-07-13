import type { CalcChar, CharInfo, Level, PartyData, Talent } from "@Src/types";
import {
  ARTIFACT_PERCENT_STAT_TYPES,
  ATTACK_ELEMENTS,
  CORE_STAT_TYPES,
  OTHER_PERCENT_STAT_TYPES,
  TALENT_TYPES,
  VISION_TYPES,
} from "@Src/constants";
import { findCharacter } from "@Data/controllers";

export const deepCopy = <T>(item: T): T => JSON.parse(JSON.stringify(item));

export const wikiImg = (src: string) => {
  return `https://static.wikia.nocookie.net/gensin-impact/images/${src}.png`;
};

export const percentSign = (stat: string) => {
  if (
    ARTIFACT_PERCENT_STAT_TYPES.includes(stat as any) ||
    OTHER_PERCENT_STAT_TYPES.includes(stat as any) ||
    ATTACK_ELEMENTS.includes(stat as any)
  ) {
    return "%";
  }
  return "";
};

export const getAllStats = () => [
  ...CORE_STAT_TYPES,
  "em",
  ...VISION_TYPES,
  ...OTHER_PERCENT_STAT_TYPES,
];

export const turnArr = <T>(subject: T | T[]): T[] => {
  return Array.isArray(subject) ? subject : [subject];
};

export const pickOne = <T>(subject: T | T[], index: number): T => {
  return Array.isArray(subject) ? subject[index] : subject;
};

export const applyToOneOrMany = <T>(base: T | T[], callback: (base: T, index?: number) => T) => {
  return Array.isArray(base) ? base.map(callback) : callback(base);
};

export function isOne(obj1: any, obj2: any) {
  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false;
  }
  for (const k in obj1) {
    if (typeof obj1[k] === "object" && typeof obj2[k] === "object" && isOne(obj1[k], obj2[k])) {
      continue;
    } else if (obj1[k] !== obj2[k]) {
      return false;
    }
  }
  return true;
}

export function extractData(object: any, projection: string): unknown {
  const result: any = {};
  for (const field of projection.split(" ")) {
    result[field] = object[field];
  }
  return result;
}

export const bareLv = (lv: Level) => +lv.split("/")[0];

export const splitLv = (subject: { level: Level }) => {
  return subject.level.split("/").map((lv) => +lv);
};

export const ascsFromLv = (lv: Level) => {
  const maxLv = +lv.slice(-2);
  return maxLv === 20 ? 0 : maxLv / 10 - 3;
};

const find = (key: string) => {
  return <T>(arr: T[], value?: string | number | null): T | undefined => {
    if (!value) {
      return undefined;
    }
    return arr.find((item) => (item as any)[key] === value);
  };
};
const findIndex = (key: string) => {
  return <T>(arr: T[], value: string | number) => {
    return arr.findIndex((item) => (item as any)[key] === value);
  };
};

export const findById = find("ID");
export const findByIndex = find("index");
export const findByCode = find("code");
export const findByName = find("name");

export const indexById = findIndex("ID");
export const indexByIndex = findIndex("index");
export const indexByCode = findIndex("code");
export const indexByName = findIndex("name");

export const roundMaker = (x: number) => (n: number) => {
  const pow = Math.pow(10, x);
  return Math.round(n * pow) / pow;
};

export const round1 = roundMaker(1);
export const round2 = roundMaker(2);
export const round3 = roundMaker(3);

export const applyPercent = (n: number, pct: number) => Math.round((n * pct) / 100);

export const toMultiplier = (n: number) => 1 + n / 100;

// #to-check
export const initArtStatFilter = () => ({
  main: "All",
  subs: Array(4).fill("All"),
});

export function totalXtraTalentLv(
  char: CharInfo,
  talentType: Exclude<Talent, "AltSprint">,
  partyData?: PartyData
) {
  let result = 0;

  const talent = findCharacter(char)!.activeTalents[talentType];

  if ("xtraLvAtCons" in talent && char.cons >= talent.xtraLvAtCons) {
    result += 3;
  }
  if (partyData) {
    if (talentType === "NAs" && (char.name === "Tartaglia" || findByName(partyData, "Tartaglia"))) {
      result++;
    }
  }
  return result;
}

export const finalTalentLv = (
  char: CharInfo,
  talentType: Exclude<Talent, "AltSprint">,
  partyData?: PartyData
) => {
  return char[talentType] + totalXtraTalentLv(char, talentType, partyData);
};

export function getCurrentChar(char: CalcChar, index: number): CharInfo {
  return {
    name: char.name,
    level: pickOne(char.level, index),
    NAs: pickOne(char.NAs, index),
    ES: pickOne(char.ES, index),
    EB: pickOne(char.EB, index),
    cons: pickOne(char.cons, index),
  };
}

export function processNumInput(input: string, before: number, max: number = 9999) {
  if (input === "") {
    return 0;
  }
  const numInput = +input;
  if (typeof numInput === "number" && numInput >= 0 && numInput <= max) {
    if (input.slice(-1) === ".") {
      return input as unknown as number;
    }
    return Math.round(numInput * 10) / 10;
  }
  return before;
}
