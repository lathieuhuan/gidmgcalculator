import type {
  AttackElement,
  CalcArtifact,
  CalcWeapon,
  CharData,
  Level,
  PartyData,
  UserArtifact,
  UserWeapon,
  Vision,
  WeaponType,
} from "@Src/types";
import {
  ARTIFACT_PERCENT_STAT_TYPES,
  ATTACK_ELEMENTS,
  LEVELS,
  OTHER_PERCENT_STAT_TYPES,
} from "@Src/constants";
import { ARTIFACT_MAIN_STATS } from "@Src/constants/artifact-stats";
import { BASE_ATTACK_TYPE, SUBSTAT_SCALE } from "@Src/constants/weapon-stats";

export const percentSign = (stat: string) => {
  if (
    ARTIFACT_PERCENT_STAT_TYPES.includes(stat as any) ||
    OTHER_PERCENT_STAT_TYPES.includes(stat as any) ||
    ATTACK_ELEMENTS.includes(stat as any) ||
    ["pct", "mult", "defIgnore"].includes(stat)
  ) {
    return "%";
  }
  return "";
};

//
export const bareLv = (lv: Level) => +lv.split("/")[0];

export const splitLv = (subject: { level: Level }) => {
  return subject.level.split("/").map((lv) => +lv);
};

export const ascsFromLv = (lv: Level) => {
  const maxLv = +lv.slice(-2);
  return maxLv === 20 ? 0 : maxLv / 10 - 3;
};

export function countVision(partyData: PartyData, charData?: CharData) {
  const result: Partial<Record<Vision, number>> = {};
  if (charData) {
    result[charData.vision] = 1;
  }
  return partyData.reduce((count, teammateData) => {
    if (teammateData) {
      count[teammateData.vision] = (count[teammateData.vision] || 0) + 1;
    }

    return count;
  }, result);
}

export function userItemToCalcItem(item: UserWeapon, newID?: number): CalcWeapon;
export function userItemToCalcItem(item: UserArtifact, newID?: number): CalcArtifact;
export function userItemToCalcItem(
  item: UserWeapon | UserArtifact,
  newID = Date.now()
): CalcWeapon | CalcArtifact {
  const { owner, setupIDs, ...info } = item;
  return info;
}

interface IOptions {
  ID?: number;
  owner?: string;
  setupIDs?: number[];
}
export function calcItemToUserItem(item: CalcArtifact, options?: IOptions): UserArtifact;
export function calcItemToUserItem(item: CalcWeapon, options?: IOptions): UserWeapon;
export function calcItemToUserItem(
  item: CalcArtifact | CalcWeapon,
  options?: IOptions
): UserArtifact | UserWeapon {
  const { ID = item.ID, owner = null, setupIDs } = options || {};

  return {
    ...item,
    ID,
    owner,
    ...(setupIDs ? { setupIDs } : undefined),
  };
}

export const getDefaultAttPattInfo = (
  key: "NAs" | "ES" | "EB",
  weaponType: WeaponType,
  vision: Vision
): {
  attElmt: AttackElement;
  multType: number;
} => {
  const attElmt = key === "NAs" && weaponType !== "catalyst" ? "phys" : vision;

  return {
    attElmt,
    multType: attElmt === "phys" ? 1 : 2,
  };
};

export function artifactMainStatValue(artifact: CalcArtifact) {
  const { type, level, rarity = 5, mainStatType } = artifact;
  return ARTIFACT_MAIN_STATS[type][mainStatType]?.[rarity][level] || 0;
}

export const weaponMainStatValue = (scale: string, lv: Level) => {
  return BASE_ATTACK_TYPE[scale][LEVELS.indexOf(lv)];
};

export const weaponSubStatValue = (scale: string, lv: Level) => {
  const curLv = bareLv(lv);
  const index = curLv === 1 ? 0 : curLv === 20 ? 1 : (curLv - 20) / 10;
  return SUBSTAT_SCALE[scale][index];
};
