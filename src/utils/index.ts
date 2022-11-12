import type { CharInfo, Level, Party, PartyData, Talent, Vision, Weapon } from "@Src/types";
import {
  ARTIFACT_PERCENT_STAT_TYPES,
  ATTACK_ELEMENTS,
  CORE_STAT_TYPES,
  OTHER_PERCENT_STAT_TYPES,
  VISION_TYPES,
} from "@Src/constants";
import { findCharacter } from "@Data/controllers";

export const deepCopy = <T>(item: T): T => JSON.parse(JSON.stringify(item));

export const randomString = (n: number) => {
  return Math.random()
    .toString(36)
    .slice(2, 2 + n);
};

export function pickProps<M, T extends keyof M>(obj: M, keys: T[]): Pick<M, T> {
  return keys.reduce((accumulator, key) => {
    accumulator[key] = obj[key];
    return accumulator;
  }, {} as Pick<M, T>);
}

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

export const turnArray = <T>(subject: T | T[]): T[] => {
  return Array.isArray(subject) ? subject : [subject];
};

export const pickOne = <T>(subject: T | T[], index: number): T => {
  return Array.isArray(subject) ? subject[index] : subject;
};

export const applyToOneOrMany = <T>(base: T | T[], callback: (base: T, index?: number) => T) => {
  return Array.isArray(base) ? base.map(callback) : callback(base);
};

const find = (key: string) => {
  return <T>(arr: T[], value?: string | number | null): T | undefined => {
    if (value === undefined) {
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

export const toMult = (n: number) => 1 + n / 100;

export const genNumberSequenceOptions = (
  max: number | undefined = 0,
  startsAt0: boolean = false,
  min: number = 1
) => {
  const result = [...Array(max)].map((_, i) => {
    const value = i + min;
    return { label: value, value };
  });
  return startsAt0 ? [{ label: 0, value: 0 }].concat(result) : result;
};

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

//
export const bareLv = (lv: Level) => +lv.split("/")[0];

export const splitLv = (subject: { level: Level }) => {
  return subject.level.split("/").map((lv) => +lv);
};

export const ascsFromLv = (lv: Level) => {
  const maxLv = +lv.slice(-2);
  return maxLv === 20 ? 0 : maxLv / 10 - 3;
};

export function totalXtraTalentLv(
  char: CharInfo,
  talentType: Exclude<Talent, "altSprint">,
  partyData?: PartyData
) {
  let result = 0;

  if (talentType === "NAs") {
    if (char.name === "Tartaglia" || (partyData && findByName(partyData, "Tartaglia"))) {
      result++;
    }
  } else {
    const talent = findCharacter(char)!.activeTalents[talentType];
    if (talent.xtraLvAtCons && char.cons >= talent.xtraLvAtCons) {
      result += 3;
    }
  }
  return result;
}

export const finalTalentLv = (
  char: CharInfo,
  talentType: Exclude<Talent, "altSprint">,
  partyData?: PartyData
) => {
  return char[talentType] + totalXtraTalentLv(char, talentType, partyData);
};

export function countWeapon(party: Party) {
  const result = {} as Partial<Record<Weapon, number>>;

  for (const teammate of party) {
    if (teammate) {
      const teammateData = findCharacter(teammate);

      if (teammateData) {
        result[teammateData.weapon] = (result[teammateData.weapon] || 0) + 1;
      } else {
        console.log(`Teamate name ${teammate.name} not found`);
      }
    }
  }
  return result;
}
