import type {
  CalcArtifact,
  CalcWeapon,
  Level,
  Party,
  UserArtifact,
  UserWeapon,
  WeaponType,
} from "@Src/types";
import {
  ARTIFACT_PERCENT_STAT_TYPES,
  ATTACK_ELEMENTS,
  OTHER_PERCENT_STAT_TYPES,
} from "@Src/constants";

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
