import type {
  ArtifactAttribute,
  CalcArtInfo,
  CalcArtPieces,
  CalcArtSet,
  CalcCharData,
  CalcWeapon,
  CharInfo,
  DataWeapon,
  Level,
  PartyData,
  TotalAttribute,
  Tracker,
} from "@Src/types";
import { ATTRIBUTE_STAT_TYPES, BASE_STAT_TYPES, CORE_STAT_TYPES, LEVELS } from "@Src/constants";
import { applyPercent, ascsFromLv, toMultiplier } from "@Src/utils";
import { findArtifactSet, findCharacter, findWeapon } from "@Data/controllers";
import { artifactMainStatValue } from "@Data/artifacts/utils";
import { wpMainStatAtLv, wpSubStatAtLv } from "@Data/weapons/utils";
import type { Wrapper1 } from "./types";
import { addOrInit, pushOrMergeTrackerRecord } from "./utils";

export function initiateTotalAttr(
  char: CharInfo,
  wpData: DataWeapon,
  weapon: CalcWeapon,
  tracker?: Tracker
) {
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
  innerStats.naAtkSpd = innerStats.caAtkSpd = 100;

  // Kokomi
  if (charData.code === 42) {
    innerStats.cRate -= 100;
    innerStats.healBn = 25;
  }

  for (const type in innerStats) {
    const key = type as keyof typeof innerStats;
    totalAttr[key] += innerStats[key];

    if (tracker) {
      const field = type.slice(0, 4) === "base" ? type.slice(5) : type;
      tracker[field].push({ desc: "Character Base stat", value: innerStats[key] });
    }
  }
  const weaponAtk = wpMainStatAtLv(wpData.mainStatScale, weapon.level);
  totalAttr.base_atk += weaponAtk;

  if (tracker) {
    tracker.atk.push({ desc: "Weapon Main stat", value: weaponAtk });
  }
  return totalAttr;
}

export function addArtAttr(
  pieces: CalcArtPieces,
  totalAttr: TotalAttribute,
  tracker?: Tracker
): ArtifactAttribute {
  const artAttr = { hp: 0, atk: 0, def: 0 } as ArtifactAttribute;

  for (const artPiece of pieces) {
    if (!artPiece) continue;

    const { type, mainStatType, subStats } = artPiece;
    const mainStat = artifactMainStatValue(artPiece);

    addOrInit(artAttr, mainStatType, mainStat);

    if (tracker) {
      tracker[mainStatType].push({ desc: type, value: mainStat });
    }
    for (const subStat of subStats) {
      addOrInit(artAttr, subStat.type, subStat.value);
      pushOrMergeTrackerRecord(tracker, subStat.type, "Artifact Sub-stat", subStat.value);
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

export function addWpSubStat(
  totalAttr: TotalAttribute,
  wpData: DataWeapon,
  wpLevel: Level,
  tracker?: Tracker
) {
  if (wpData.subStat) {
    const { type, scale } = wpData.subStat;
    const value = wpSubStatAtLv(scale, wpLevel);
    totalAttr[type] += value;

    if (tracker) {
      const record = { desc: `${wpData.name} Sub-stat`, value };
      if (type === "phys") {
        tracker[type].pct.push(record);
      } else {
        tracker[type].push(record);
      }
    }
  }
}

export function applyArtPassiveBuffs(
  isFinal: boolean,
  sets: CalcArtSet[],
  wrapper: Wrapper1,
  partyData?: PartyData
) {
  for (const { code, bonusLv } of sets) {
    //
    for (let i = 0; i <= bonusLv; i++) {
      const { applyBuff, applyFinalBuff } = findArtifactSet({ code })!.setBonuses[i];

      if (!isFinal && applyBuff) {
        applyBuff({ ...wrapper, partyData });
      } else if (isFinal && applyFinalBuff) {
        applyFinalBuff({ ...wrapper, partyData });
      }
    }
  }
}

export function applyWpPassiveBuffs(
  isFinal: boolean,
  wpData: DataWeapon,
  refi: number,
  wrapper: Wrapper1,
  partyData?: PartyData
) {
  const { applyBuff, applyFinalBuff } = wpData;
  const applyFn =
    !isFinal && applyBuff ? applyBuff : isFinal && applyFinalBuff ? applyFinalBuff : undefined;

  if (applyFn) {
    applyFn({ ...wrapper, refi, partyData });
  }
}

export function calcFinalTotalAttrs(totalAttr: TotalAttribute) {
  for (const type of CORE_STAT_TYPES) {
    totalAttr[type] += Math.round(totalAttr[`base_${type}`]) * toMultiplier(totalAttr[`${type}_`]);
    delete totalAttr[`${type}_`];
  }
}

export default function getBaseStats(
  charData: CalcCharData,
  char: CharInfo,
  weapon: CalcWeapon,
  artifact: CalcArtInfo
) {
  //
  const wpData = findWeapon(weapon)!;
  const totalAttr = initiateTotalAttr(char, wpData, weapon);
  const artAttr = addArtAttr(artifact.pieces, totalAttr);
  addWpSubStat(totalAttr, wpData, weapon.level);

  const wrapper = { totalAttr, charData };
  applyArtPassiveBuffs(false, artifact.sets, wrapper);
  applyWpPassiveBuffs(false, wpData, weapon.refi, wrapper);
  calcFinalTotalAttrs(totalAttr);
  return [totalAttr, artAttr] as const;
}
