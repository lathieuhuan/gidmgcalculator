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
} from "@Src/types";
import type { Tracker, BaseModifierArgsWrapper } from "./types";

import { ATTRIBUTE_STAT_TYPES, BASE_STAT_TYPES, CORE_STAT_TYPES, LEVELS } from "@Src/constants";
import { applyPercent, ascsFromLv, toMult } from "@Src/utils";
import { findArtifactSet, findCharacter, findWeapon } from "@Data/controllers";
import { artifactMainStatValue } from "@Data/artifacts/utils";
import { wpMainStatAtLv, wpSubStatAtLv } from "@Data/weapons/utils";
import { addOrInit, pushOrMergeTrackerRecord } from "./utils";

interface InitiateTotalAttrArgs {
  char: CharInfo;
  weapon: CalcWeapon;
  weaponData: DataWeapon;
  tracker?: Tracker;
}
export function initiateTotalAttr({ char, weapon, weaponData, tracker }: InitiateTotalAttrArgs) {
  const charData = findCharacter(char)!;
  const [base_hp, base_atk, base_def] = charData.stats[LEVELS.indexOf(char.level)];

  const totalAttr = {} as TotalAttribute;

  for (const type of [...BASE_STAT_TYPES, ...ATTRIBUTE_STAT_TYPES]) {
    totalAttr[type] = 0;
  }
  const innerStats = {
    base_hp,
    base_atk,
    base_def,
  } as TotalAttribute;

  const scale = [0, 1, 2, 2, 3, 4][Math.max(ascsFromLv(char.level) - 1, 0)];
  innerStats[charData.bonusStat.type] = charData.bonusStat.value * scale;

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

  for (const type in innerStats) {
    const key = type as keyof typeof innerStats;
    totalAttr[key] += innerStats[key];

    // if (tracker) {
    //   const field = type.slice(0, 4) === "base" ? type.slice(5) : type;
    //   tracker[field].push({ desc: "Character Base stat", value: innerStats[key] });
    // }
  }
  const weaponAtk = wpMainStatAtLv(weaponData.mainStatScale, weapon.level);
  totalAttr.base_atk += weaponAtk;

  // if (tracker) {
  //   tracker.atk.push({ desc: "Weapon Main stat", value: weaponAtk });
  // }
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

    // if (tracker) {
    //   tracker[mainStatType].push({ desc: type, value: mainStat });
    // }
    for (const subStat of subStats) {
      addOrInit(artAttr, subStat.type, subStat.value);
      // pushOrMergeTrackerRecord(tracker, subStat.type, "Artifact Sub-stat", subStat.value);
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

interface AddWpSubStatArgs {
  totalAttr: TotalAttribute;
  weaponData: DataWeapon;
  wpLevel: Level;
  tracker?: Tracker;
}
export function addWpSubStat({ totalAttr, weaponData, wpLevel, tracker }: AddWpSubStatArgs) {
  if (weaponData.subStat) {
    const { type, scale } = weaponData.subStat;
    const value = wpSubStatAtLv(scale, wpLevel);
    totalAttr[type] += value;

    // if (tracker) {
    //   const record = { desc: `${weaponData.name} Sub-stat`, value };
    //   if (type === "phys") {
    //     tracker[type].pct.push(record);
    //   } else {
    //     tracker[type].push(record);
    //   }
    // }
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
      const { applyBuff, applyFinalBuff } = findArtifactSet({ code })!.setBonuses[i];

      if (!isFinal && applyBuff) {
        applyBuff(modifierArgs);
      } else if (isFinal && applyFinalBuff) {
        applyFinalBuff(modifierArgs);
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
  const { applyBuff, applyFinalBuff } = weaponData;
  const applyFn =
    !isFinal && applyBuff ? applyBuff : isFinal && applyFinalBuff ? applyFinalBuff : undefined;

  if (applyFn) {
    applyFn({ ...modifierArgs, refi });
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
  addWpSubStat({ totalAttr, weaponData, wpLevel: weapon.level });

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
