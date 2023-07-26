import type {
  AppSettings,
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
  Vision,
  WeaponType,
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

export const itemIsWeapon = (item: UserWeapon | UserArtifact): item is UserWeapon => "refi" in item;

export function countVision(partyData: PartyData, charData?: AppCharacter) {
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
  vision: Vision,
  attPatt?: AttackPattern
): {
  attElmt: AttackElement;
  scale: number;
  attributeType: TalentAttributeType;
  flatFactorScale: number;
} => {
  const attElmt = key === "NAs" && weaponType !== "catalyst" ? "phys" : vision;

  return {
    attElmt,
    scale: attPatt === "PA" ? 7 : attElmt === "phys" ? 1 : 2,
    attributeType: "atk",
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

const getAppSettings = (): AppSettings => {
  let savedSettings = localStorage.getItem("settings");
  const defaultSettings: AppSettings = {
    charInfoIsSeparated: false,
    doKeepArtStatsOnSwitch: false,
    persistingUserData: false,
    charLevel: "1/20",
    charCons: 0,
    charNAs: 1,
    charES: 1,
    charEB: 1,
    wpLevel: "1/20",
    wpRefi: 1,
    artLevel: 0,
  };

  return savedSettings
    ? {
        ...defaultSettings,
        ...(JSON.parse(savedSettings) as AppSettings),
      }
    : defaultSettings;
};

const setAppSettings = (newSettings: Partial<AppSettings>) => {
  localStorage.setItem(
    "settings",
    JSON.stringify({
      ...getAppSettings(),
      ...newSettings,
    })
  );
};

export const appSettings = {
  get: getAppSettings,
  set: setAppSettings,
};
