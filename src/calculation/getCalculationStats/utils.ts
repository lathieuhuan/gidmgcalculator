import type {
  AppCharacter,
  AppWeapon,
  ArtifactAttribute,
  ArtifactSetBonus,
  BuffModifierArgsWrapper,
  CalcArtifacts,
  CalcWeapon,
  CharInfo,
  CoreStat,
  Level,
  ModifierCtrl,
  TotalAttribute,
  Tracker,
  TrackerRecord,
} from "@Src/types";
import { ATTRIBUTE_STAT_TYPES, BASE_STAT_TYPES, CORE_STAT_TYPES, LEVELS } from "@Src/constants";

import {
  applyPercent,
  artifactMainStatValue,
  ascsFromLv,
  findByIndex,
  weaponMainStatValue,
  weaponSubStatValue,
} from "@Src/utils";
import { applyModifier } from "@Src/utils/calculation";
import { findDataArtifactSet } from "@Data/controllers";

function addOrInit<T extends Partial<Record<K, number | undefined>>, K extends keyof T>(obj: T, key: K, value: number) {
  obj[key] = (((obj[key] as number | undefined) || 0) + value) as T[K];
}

export const addTrackerRecord = (list: TrackerRecord[] | undefined, desc: string, value: number) => {
  if (!list) {
    return;
  }

  const existed = list.find((note: any) => note.desc === desc);
  if (existed) {
    existed.value += value;
  } else {
    list.push({ desc, value });
  }
};

interface InitiateTotalAttrArgs {
  char: CharInfo;
  charData: AppCharacter;
  weapon: CalcWeapon;
  weaponData: AppWeapon;
  tracker?: Tracker;
}
export const initiateTotalAttr = ({ char, charData, weapon, weaponData, tracker }: InitiateTotalAttrArgs) => {
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
  addOrInit(innerStats, "cRate_", 5);
  addOrInit(innerStats, "cDmg_", 50);
  addOrInit(innerStats, "er_", 100);
  addOrInit(innerStats, "naAtkSpd_", 100);
  addOrInit(innerStats, "caAtkSpd_", 100);

  // Kokomi
  if (charData.code === 42) {
    innerStats.cRate_ -= 100;
    innerStats.healB_ = 25;
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
  const weaponAtk = weaponMainStatValue(weaponData.mainStatScale, weapon.level);
  totalAttr.base_atk += weaponAtk;
  addTrackerRecord(tracker?.totalAttr.atk, "Weapon main stat", weaponAtk);

  return totalAttr;
};

interface ApplySelfBuffs {
  isFinal: boolean;
  modifierArgs: BuffModifierArgsWrapper;
  charBuffCtrls?: ModifierCtrl[];
  charData: AppCharacter;
}
export const applySelfBuffs = ({ isFinal, modifierArgs, charBuffCtrls, charData }: ApplySelfBuffs) => {
  if (charBuffCtrls?.length) {
    const { char } = modifierArgs;
    const { innateBuffs = [], buffs = [] } = charData;

    for (const { src, isGranted, applyBuff, applyFinalBuff } of innateBuffs) {
      if (isGranted(char)) {
        const applyFn = !isFinal && applyBuff ? applyBuff : isFinal && applyFinalBuff ? applyFinalBuff : undefined;

        applyFn?.({
          desc: `Self / ${src}`,
          charBuffCtrls,
          ...modifierArgs,
        });
      }
    }

    for (const { index, activated, inputs = [] } of charBuffCtrls) {
      const buff = findByIndex(buffs, index);

      if (buff && (!buff.isGranted || buff.isGranted(char)) && activated) {
        const applyFn =
          !isFinal && buff.applyBuff
            ? buff.applyBuff
            : isFinal && buff.applyFinalBuff
            ? buff.applyFinalBuff
            : undefined;

        applyFn?.({
          desc: `Self / ${buff.src}`,
          toSelf: true,
          charBuffCtrls,
          inputs,
          ...modifierArgs,
        });
      }
    }
  }
};

interface AddArtAttrArgs {
  artifacts: CalcArtifacts;
  totalAttr: TotalAttribute;
  tracker?: Tracker;
}
export const addArtifactAttributes = ({ artifacts, totalAttr, tracker }: AddArtAttrArgs): ArtifactAttribute => {
  const artAttr = { hp: 0, atk: 0, def: 0 } as ArtifactAttribute;

  for (const artifact of artifacts) {
    if (!artifact) continue;

    const { type, mainStatType, subStats } = artifact;
    const mainStat = artifactMainStatValue(artifact);

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
};

interface addWeaponSubStatArgs {
  totalAttr: TotalAttribute;
  weaponData: AppWeapon;
  wpLevel: Level;
  tracker?: Tracker;
}
export const addWeaponSubStat = ({ totalAttr, weaponData, wpLevel, tracker }: addWeaponSubStatArgs) => {
  if (weaponData.subStat) {
    const { type, scale } = weaponData.subStat;
    const value = weaponSubStatValue(scale, wpLevel);

    applyModifier(`${weaponData.name} sub-stat`, totalAttr, type, value, tracker);
  }
};

interface applyArtifactAutoBuffsArgs {
  isFinal: boolean;
  setBonuses: ArtifactSetBonus[];
  modifierArgs: BuffModifierArgsWrapper;
}
export const applyArtifactAutoBuffs = ({ isFinal, setBonuses, modifierArgs }: applyArtifactAutoBuffsArgs) => {
  for (const { code, bonusLv } of setBonuses) {
    //
    for (let i = 0; i <= bonusLv; i++) {
      const artData = findDataArtifactSet({ code });

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
};

export const calcFinalTotalAttributes = (totalAttr: TotalAttribute) => {
  for (const type of CORE_STAT_TYPES) {
    totalAttr[type] += applyPercent(totalAttr[`base_${type}`], totalAttr[`${type}_`]);
    totalAttr[`${type}_`] = 0;
  }
};