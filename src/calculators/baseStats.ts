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

export function initiateTotalAttrs(
  char: CharInfo,
  wpData: DataWeapon,
  weapon: CalcWeapon,
  tracker?: Tracker
) {
  const totalAttrs = {} as TotalAttribute;

  for (const type of [...BASE_STAT_TYPES, ...ATTRIBUTE_STAT_TYPES]) {
    totalAttrs[type] = 0;
  }
  const charData = findCharacter(char)!;

  const stats = {
    ...charData.stats[LEVELS.indexOf(char.level)],
  } as TotalAttribute;

  if (charData.bonusStats) {
    const scale = [1, 2, 2, 3, 4][ascsFromLv(char.level) - 1];

    for (const { type, value } of charData.bonusStats) {
      totalAttrs[type] += value * scale;
    }
  }

  addOrInit(stats, "cRate", 5);
  addOrInit(stats, "cDmg", 50);
  addOrInit(stats, "er", 50);
  stats.naAtkSpd = stats.caAtkSpd = 100;

  for (const type in stats) {
    const key = type as keyof typeof stats;
    totalAttrs[key] += stats[key];

    if (tracker) {
      const field = type.slice(0, 4) === "base" ? type.slice(5) : type;
      tracker[field].push({ desc: "Character Base stat", value: stats[key] });
    }
  }
  const weaponAtk = wpMainStatAtLv(wpData.mainStatScale, weapon.level);
  totalAttrs.base_atk += weaponAtk;

  if (tracker) {
    tracker.atk.push({ desc: "Weapon Main stat", value: weaponAtk });
  }
  return totalAttrs;
}

export function addArtAttrs(
  pieces: CalcArtPieces,
  totalAttrs: TotalAttribute,
  tracker?: Tracker
): ArtifactAttribute {
  const artAttrs = { hp: 0, atk: 0, def: 0 } as ArtifactAttribute;

  for (const artPiece of pieces) {
    if (!artPiece) {
      continue;
    }
    const { type, mainStatType, subStats } = artPiece;
    const mainStat = artifactMainStatValue(artPiece);

    addOrInit(artAttrs, mainStatType, mainStat);

    if (tracker) {
      tracker[mainStatType].push({ desc: type, value: mainStat });
    }
    for (const subStat of subStats) {
      addOrInit(artAttrs, subStat.type, subStat.value);
      pushOrMergeTrackerRecord(tracker, subStat.type, "Artifact Sub-stat", subStat.value);
    }
  }
  for (const statType of CORE_STAT_TYPES) {
    const percentStatValue = artAttrs[`${statType}_`];
    if (percentStatValue) {
      artAttrs[statType] += applyPercent(totalAttrs[`base_${statType}`], percentStatValue);
    }
    delete artAttrs[`${statType}_`];
  }
  for (const type in artAttrs) {
    const key = type as keyof typeof artAttrs;
    totalAttrs[key] += artAttrs[key] || 0;
  }
  return artAttrs;
}

export function addWpSubStat(
  totalAttrs: TotalAttribute,
  wpData: DataWeapon,
  wpLevel: Level,
  tracker?: Tracker
) {
  if (wpData.subStat) {
    const { type, scale } = wpData.subStat;
    const value = wpSubStatAtLv(scale, wpLevel);
    totalAttrs[type] += value;

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

export function applyArtPassiveBuffs(isFinal: boolean, sets: CalcArtSet[], wrapper: Wrapper1) {
  for (const { code, bonusLv } of sets) {
    //
    for (let i = 0; i <= bonusLv; i++) {
      const { applyBuff, applyFinalBuff } = findArtifactSet({ code })!.setBonuses[i];

      if (!isFinal && applyBuff) {
        applyBuff(wrapper);
      } else if (isFinal && applyFinalBuff) {
        applyFinalBuff(wrapper);
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
  if (!isFinal && applyBuff) {
    applyBuff({ ...wrapper, refi, partyData });
  } else if (isFinal && applyFinalBuff) {
    applyFinalBuff({ ...wrapper, refi });
  }
}

export function calcFinalTotalAttrs(totalAttrs: TotalAttribute) {
  for (const type of CORE_STAT_TYPES) {
    totalAttrs[type] +=
      Math.round(totalAttrs[`base_${type}`]) * toMultiplier(totalAttrs[`${type}_`]);
    delete totalAttrs[`${type}_`];
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
  const totalAttrs = initiateTotalAttrs(char, wpData, weapon);
  const artAttrs = addArtAttrs(artifact.pieces, totalAttrs);
  addWpSubStat(totalAttrs, wpData, weapon.level);

  const wrapper = { totalAttrs, charData };
  applyArtPassiveBuffs(false, artifact.sets, wrapper);
  applyWpPassiveBuffs(false, wpData, weapon.refi, wrapper);
  calcFinalTotalAttrs(totalAttrs);
  return [totalAttrs, artAttrs] as const;
}
