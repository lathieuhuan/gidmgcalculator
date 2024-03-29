import type {
  AttackElement,
  AttackPattern,
  CalcArtifact,
  CalcWeapon,
  AppCharacter,
  Level,
  PartyData,
  TalentAttributeType,
  UserArtifact,
  UserWeapon,
  ElementType,
  WeaponType,
  Teammate,
  Party,
  CharInfo,
  CharacterMilestone,
} from "@Src/types";
import { ATTACK_ELEMENTS, LEVELS } from "@Src/constants";
import { ARTIFACT_MAIN_STATS } from "@Src/constants/artifact-stats";
import { BASE_ATTACK_TYPE, SUBSTAT_SCALE } from "@Src/constants/weapon-stats";

export const percentSign = (stat: string) => {
  if (stat.slice(-1) === "_" || ATTACK_ELEMENTS.includes(stat as any)) {
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

export const isUserWeapon = (item: UserWeapon | UserArtifact): item is UserWeapon => "refi" in item;

export const isGranted = ({ grantedAt }: { grantedAt?: CharacterMilestone }, char: CharInfo) => {
  if (grantedAt) {
    const [prefix, level] = grantedAt;
    return (prefix === "A" ? ascsFromLv(char.level) : char.cons) >= +level;
  }
  return true;
};

export function countElements(partyData: PartyData, appChar?: AppCharacter) {
  const result: Partial<Record<ElementType, number>> = {};
  if (appChar) {
    result[appChar.vision] = 1;
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
export function userItemToCalcItem(item: UserWeapon | UserArtifact, newID = Date.now()): CalcWeapon | CalcArtifact {
  const { owner, setupIDs, ...info } = item;
  return info;
}

interface Options {
  ID?: number;
  owner?: string;
  setupIDs?: number[];
}
export function calcItemToUserItem(item: CalcArtifact, options?: Options): UserArtifact;
export function calcItemToUserItem(item: CalcWeapon, options?: Options): UserWeapon;
export function calcItemToUserItem(item: CalcArtifact | CalcWeapon, options?: Options): UserArtifact | UserWeapon {
  const { ID = item.ID, owner = null, setupIDs } = options || {};

  return {
    ...item,
    ID,
    owner,
    ...(setupIDs ? { setupIDs } : undefined),
  };
}

export const getTalentDefaultInfo = (
  key: "NAs" | "ES" | "EB",
  weaponType: WeaponType,
  elementType: ElementType,
  attPatt: AttackPattern,
  config?: AppCharacter["multFactorConf"]
): {
  attElmt: AttackElement;
  scale: number;
  basedOn: TalentAttributeType;
  flatFactorScale: number;
} => {
  const attElmt = key === "NAs" && weaponType !== "catalyst" ? "phys" : elementType;
  const defaultScale = attPatt === "PA" ? 7 : attElmt === "phys" ? 1 : 2;
  const defaultBasedOn: TalentAttributeType = "atk";
  const { scale = defaultScale, basedOn = defaultBasedOn } = config?.[attPatt] || {};

  return {
    attElmt,
    scale,
    basedOn,
    flatFactorScale: 3,
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

export const toCustomBuffLabel = (category: string, type: string, t: (origin: string) => string) => {
  return category === "attElmtBonus" ? (type === "phys" ? "physical" : type) : t(type);
};

export const realParty = (party?: Party) => (party?.filter(Boolean) as Teammate[]) ?? [];
