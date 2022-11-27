import type {
  ArtifactAttribute,
  CalcArtInfo,
  CalcArtPieces,
  CalcArtSet,
  CharData,
  CalcWeapon,
  CharInfo,
  DataWeapon,
  Level,
  TotalAttribute,
  CoreStat,
} from "@Src/types";
import type { Tracker, BaseModifierArgsWrapper } from "./types";

import { ATTRIBUTE_STAT_TYPES, BASE_STAT_TYPES, CORE_STAT_TYPES, LEVELS } from "@Src/constants";
import { applyPercent, ascsFromLv, toMult } from "@Src/utils";
import { findArtifactSet, findCharacter, findWeapon } from "@Data/controllers";
import { artifactMainStatValue } from "@Data/artifacts/utils";
import { wpMainStatAtLv, wpSubStatAtLv } from "@Data/weapons/utils";
import { addOrInit, addTrackerRecord, applyModifier } from "./utils";

interface InitiateTotalAttrArgs {
  char: CharInfo;
  weapon: CalcWeapon;
  weaponData: DataWeapon;
  tracker?: Tracker;
}
export function initiateTotalAttr({ char, weapon, weaponData, tracker }: InitiateTotalAttrArgs) {
  const charData = findCharacter(char)!;
  const totalAttr = {} as TotalAttribute;

  for (const type of [...BASE_STAT_TYPES, ...ATTRIBUTE_STAT_TYPES]) {
    totalAttr[type] = 0;
  }

  // Character inner stats
  const [base_hp, base_atk, base_def] = charData.stats[LEVELS.indexOf(char.level)];

  const innerStats = {
    base_hp,
    base_atk,
    base_def,
  } as TotalAttribute;

  const scaleIndex = Math.max(ascsFromLv(char.level) - 1, 0);
  const bonusScale = [0, 1, 2, 2, 3, 4][scaleIndex];

  addOrInit(innerStats, charData.bonusStat.type, charData.bonusStat.value * bonusScale);
  addOrInit(innerStats, "cRate", 5);
  addOrInit(innerStats, "cDmg", 50);
  addOrInit(innerStats, "er", 100);
  addOrInit(innerStats, "naAtkSpd", 100);
  addOrInit(innerStats, "caAtkSpd", 100);

  // Kokomi
  if (charData.code === 42) {
    innerStats.cRate -= 100;
    innerStats.healBn = 25;
  }
  const baseConvertMap: Record<string, CoreStat> = {
    base_atk: "atk",
    base_hp: "hp",
    base_def: "def",
  };

  for (const type in innerStats) {
    const key = type as keyof typeof innerStats;
    totalAttr[key] += innerStats[key];

    const trackerField = baseConvertMap[key] || key;
    addTrackerRecord(tracker?.totalAttr[trackerField], "Character base stat", innerStats[key]);
  }

  // Weapon main stat
  const weaponAtk = wpMainStatAtLv(weaponData.mainStatScale, weapon.level);
  totalAttr.base_atk += weaponAtk;
  addTrackerRecord(tracker?.totalAttr.atk, "Weapon main stat", weaponAtk);

  return totalAttr;
}

interface AddArtAttrArgs {
  pieces: CalcArtPieces;
  totalAttr: TotalAttribute;
  tracker?: Tracker;
}
export function addArtAttr({ pieces, totalAttr, tracker }: AddArtAttrArgs): ArtifactAttribute {
  const artAttr = { hp: 0, atk: 0, def: 0 } as ArtifactAttribute;

  for (const artPiece of pieces) {
    if (!artPiece) continue;

    const { type, mainStatType, subStats } = artPiece;
    const mainStat = artifactMainStatValue(artPiece);

    addOrInit(artAttr, mainStatType, mainStat);
    addTrackerRecord(tracker?.totalAttr[mainStatType], type, mainStat);

    for (const subStat of subStats) {
      addOrInit(artAttr, subStat.type, subStat.value);
      addTrackerRecord(tracker?.totalAttr[subStat.type], "Artifact sub-stat", subStat.value);
    }
  }
  for (const statType of CORE_STAT_TYPES) {
    const percentStatValue = artAttr[`${statType}_`];
    if (percentStatValue) {
      artAttr[statType] += applyPercent(totalAttr[`base_${statType}`], percentStatValue);
    }
    delete artAttr[`${statType}_`];
  }
  for (const type in artAttr) {
    const key = type as keyof typeof artAttr;
    totalAttr[key] += artAttr[key] || 0;
  }
  return artAttr;
}

interface addWeaponSubStatArgs {
  totalAttr: TotalAttribute;
  weaponData: DataWeapon;
  wpLevel: Level;
  tracker?: Tracker;
}
export function addWeaponSubStat({
  totalAttr,
  weaponData,
  wpLevel,
  tracker,
}: addWeaponSubStatArgs) {
  if (weaponData.subStat) {
    const { type, scale } = weaponData.subStat;
    const value = wpSubStatAtLv(scale, wpLevel);

    applyModifier(`${weaponData.name} sub-stat`, totalAttr, type, value, tracker);
  }
}

interface ApplyArtPassiveBuffs {
  isFinal: boolean;
  sets: CalcArtSet[];
  modifierArgs: BaseModifierArgsWrapper;
}
export function applyArtPassiveBuffs({ isFinal, sets, modifierArgs }: ApplyArtPassiveBuffs) {
  for (const { code, bonusLv } of sets) {
    //
    for (let i = 0; i <= bonusLv; i++) {
      const artData = findArtifactSet({ code });

      if (artData) {
        const { applyBuff, applyFinalBuff } = artData.setBonuses[i];
        const desc = `${artData.name} / ${i * 2 + 2}-piece bonus`;

        if (!isFinal && applyBuff) {
          applyBuff({ ...modifierArgs, desc });
        } else if (isFinal && applyFinalBuff) {
          applyFinalBuff({ ...modifierArgs, desc });
        }
      }
    }
  }
}

interface ApplyWpPassiveBuffsArgs {
  isFinal: boolean;
  weaponData: DataWeapon;
  refi: number;
  modifierArgs: BaseModifierArgsWrapper;
}
export function applyWpPassiveBuffs({
  isFinal,
  weaponData,
  refi,
  modifierArgs,
}: ApplyWpPassiveBuffsArgs) {
  const { name, applyBuff, applyFinalBuff } = weaponData;
  const applyFn =
    !isFinal && applyBuff ? applyBuff : isFinal && applyFinalBuff ? applyFinalBuff : undefined;

  if (applyFn) {
    applyFn({ desc: `${name} bonus`, ...modifierArgs, refi });
  }
}

export function calcFinalTotalAttrs(totalAttr: TotalAttribute) {
  for (const type of CORE_STAT_TYPES) {
    totalAttr[type] += Math.round(totalAttr[`base_${type}`]) * toMult(totalAttr[`${type}_`]);
    delete totalAttr[`${type}_`];
  }
}

interface GetBaseStatsArgs {
  charData: CharData;
  char: CharInfo;
  weapon: CalcWeapon;
  artifact: CalcArtInfo;
}
export default function getBaseStats({
  charData,
  char,
  weapon,
  artifact: { pieces, sets },
}: GetBaseStatsArgs) {
  //
  const weaponData = findWeapon(weapon)!;
  const totalAttr = initiateTotalAttr({ char, weaponData, weapon });
  const artAttr = addArtAttr({ pieces, totalAttr });
  addWeaponSubStat({ totalAttr, weaponData, wpLevel: weapon.level });

  const modifierArgs = { totalAttr, charData };
  applyArtPassiveBuffs({ isFinal: false, sets, modifierArgs });
  applyWpPassiveBuffs({
    isFinal: false,
    weaponData,
    refi: weapon.refi,
    modifierArgs,
  });
  calcFinalTotalAttrs(totalAttr);

  return {
    totalAttr,
    artAttr,
  };
}
