import {
  AMPLIFYING_REACTIONS,
  ATTACK_ELEMENTS,
  ATTACK_PATTERNS,
  ATTACK_PATTERN_INFO_KEYS,
  REACTIONS,
  TRANSFORMATIVE_REACTIONS,
} from "@Src/constants";
import {
  AttackElementBonus,
  AttackPatternBonus,
  AttackPatternBonusKey,
  AttackPatternInfo,
  AttributeStat,
  CalcArtInfo,
  CalcCharData,
  CalcWeapon,
  CharInfo,
  CustomBuffCtrl,
  DataWeapon,
  FinalInfusion,
  ModifierCtrl,
  Party,
  PartyData,
  Reaction,
  ReactionBonus,
  Resonance,
  SubWeaponComplexBuffCtrl,
  TotalAttribute,
  Tracker,
  Vision,
  Weapon,
} from "@Src/types";
import { findByIndex, toMultiplier } from "@Src/utils";
import { findArtifactSet, findCharacter, findWeapon } from "@Data/controllers";
import {
  addArtAttrs,
  addWpSubStat,
  applyArtPassiveBuffs,
  applyWpPassiveBuffs,
  calcFinalTotalAttrs,
  initiateTotalAttrs,
} from "./baseStats";
import type { Wrapper1, Wrapper2 } from "./types";
import {
  applyModifier,
  getRxnBonusesFromEM,
  meltMult,
  pushOrMergeTrackerRecord,
  vaporizeMult,
} from "./utils";
import { RESONANCE_STAT } from "./constants";

export function initDamageBonuses() {
  const attPattBonus = {} as AttackPatternBonus;
  const attElmtBonus = {} as AttackElementBonus;

  const initAttPattBonusField = () => {
    let result = {} as AttackPatternInfo;
    for (const key of ATTACK_PATTERN_INFO_KEYS) {
      result[key] = 0;
    }
    return result;
  };
  for (const pattern of ATTACK_PATTERNS) {
    attPattBonus[pattern] = initAttPattBonusField();
  }
  attPattBonus.all = initAttPattBonusField();

  for (const element of ATTACK_ELEMENTS) {
    attElmtBonus[element] = { cDmg: 0, flat: 0 };
  }

  return [attPattBonus, attElmtBonus] as const;
}

function applyCustomBuffs(wrapper: Required<Wrapper1>, customBuffCtrls: CustomBuffCtrl[]) {
  for (const { category, type, value } of customBuffCtrls) {
    const desc = "Custom Buff";

    if (category === 2) {
      const key = type as AttackPatternBonusKey;
      wrapper.attPattBonus[key].pct += value;
      pushOrMergeTrackerRecord(wrapper.tracker?.[key], "pct", desc, value);
    } else {
      if (category === 1) {
        const key = type as AttributeStat;
        wrapper.totalAttr[key] += value;
      } else {
        const key = type as Reaction;
        wrapper.rxnBonus[key] += value;
      }
      pushOrMergeTrackerRecord(wrapper.tracker, type as string, desc, value);
    }
  }
}

function applyResonanceBuffs(
  totalAttr: TotalAttribute,
  attPattBonus: AttackPatternBonus,
  resonance: Resonance,
  tracker: Tracker
) {
  for (const rsn of resonance) {
    if (rsn.activated) {
      const { key, value } = RESONANCE_STAT[rsn.vision];
      const desc = `${rsn.vision} Resonance`;
      applyModifier(desc, totalAttr, key, value, tracker);

      if (rsn.vision === "geo") {
        applyModifier(desc, attPattBonus, "all.pct", 15, tracker);
      }
    }
  }
}

function applyWpBuffs(
  wrapper: Required<Wrapper1>,
  wpBuffCtrls: ModifierCtrl[],
  refi: number,
  subWpComplexBuffCtrls: SubWeaponComplexBuffCtrl,
  wpData: DataWeapon
) {
  for (const [type, ctrls] of Object.entries(subWpComplexBuffCtrls)) {
    for (const ctrl of ctrls) {
      if (ctrl.activated) {
        const { code, refi, inputs } = ctrl;
        const { name, buffs } = findWeapon({ type: type as Weapon, code }) || {};
        if (buffs) {
          const { applyBuff } = findByIndex(buffs, ctrl.index) || {};
          if (applyBuff) {
            const desc = `${name} activated`;
            applyBuff({ ...wrapper, refi, inputs, desc });
          }
        } else {
          console.log(`applyWpBuffs: weapon #${code} or weapon buff #${ctrl.index} not found`);
        }
      }
    }
  }
  for (const { activated, index, inputs } of wpBuffCtrls) {
    if (wpData.buffs) {
      const { applyBuff } = findByIndex(wpData.buffs, index) || {};
      if (activated && applyBuff) {
        applyBuff({ ...wrapper, refi, inputs, desc: `${wpData.name} activated` });
      }
    } else {
      console.log(`applyWpBuffs: buffs of main weapon not found`);
    }
  }
}

function applyArtBuffs(wrapper: Required<Wrapper1>, art: CalcArtInfo) {
  for (const { activated, code, index, inputs } of art.subBuffCtrls) {
    if (activated) {
      const { name, buffs } = findArtifactSet({ code })!;
      const desc = `${name} / 4-Piece activated`;
      buffs![index].applyBuff!({ ...wrapper, inputs, desc });
    }
  }
  for (const { index, activated, inputs } of art.buffCtrls) {
    const { name, buffs } = findArtifactSet({ code: art.sets[0].code })!;
    const { applyBuff } = buffs![index];

    if (activated && applyBuff) {
      const desc = `${name} (self) / 4-Piece activated`;
      applyBuff({ ...wrapper, inputs, desc });
    }
  }
}

function applyTeammateBuffs(
  party: Party,
  partyData: PartyData,
  wrapper: Required<Wrapper1>,
  char: CharInfo,
  infusion: FinalInfusion
) {
  for (const tm of party) {
    if (!tm) {
      continue;
    }
    const { buffs } = findCharacter(tm)!;
    for (const { index, activated, inputs } of tm.buffCtrls) {
      const buff = findByIndex(buffs!, index);

      if (!buff) {
        continue;
      }
      const applyFn = buff.applyBuff || buff.applyFinalBuff;
      if (activated && applyFn) {
        const desc = `${tm.name} / ${buff.src}`;
        const wrapper2 = { char, inputs, infusion, party, partyData, desc };
        applyFn({ ...wrapper, ...wrapper2, toSelf: false, charBuffCtrls: tm.buffCtrls });
      }
    }
  }
}

function applyWpFinalBuffs(
  totalAttr: TotalAttribute,
  weapon: CalcWeapon,
  wpData: DataWeapon,
  tracker: Tracker
) {
  const { buffCtrls, refi } = weapon;
  for (let ctrl of buffCtrls) {
    if (ctrl.activated && wpData.buffs) {
      const { applyFinalBuff } = findByIndex(wpData.buffs, ctrl.index) || {};
      if (applyFinalBuff) {
        applyFinalBuff({ totalAttr, refi, desc: `${wpData.name} activated`, tracker });
      }
    } else if (!wpData.buffs) {
      console.log(`applyWpFinalBuffs: buffs of main weapon not found`);
    }
  }
}

function addArtFinalBuffs(
  totalAttr: TotalAttribute,
  attPattBonus: AttackPatternBonus,
  art: CalcArtInfo,
  tracker: Tracker
) {
  for (const ctrl of art.buffCtrls) {
    const { name, buffs } = findArtifactSet({ code: art.sets[0].code })!;
    const { applyFinalBuff } = buffs?.[ctrl.index] || {};

    if (ctrl.activated && applyFinalBuff) {
      const desc = `${name} (self) / 4-Piece activated`;
      applyFinalBuff({ totalAttr, attPattBonus, desc, tracker });
    }
  }
}

function applySelfBuffs(
  isFinal: boolean,
  wrapper: Required<Wrapper1>,
  wrapper2: Wrapper2,
  partyData: PartyData
) {
  const { char, charBuffCtrls } = wrapper2;
  const { buffs } = findCharacter(char)!;

  for (const { index, activated, inputs } of charBuffCtrls) {
    const buff = findByIndex(buffs!, index);

    if (buff && buff.isGranted(char) && activated) {
      let applyFn =
        !isFinal && buff.applyBuff
          ? buff.applyBuff
          : isFinal && buff.applyFinalBuff
          ? buff.applyFinalBuff
          : null;
      if (!applyFn) {
        continue;
      }
      const desc = `Self / ${buff.src}`;
      applyFn({ ...wrapper, ...wrapper2, partyData, inputs, toSelf: true, desc });
    }
  }
}

function calcFinalRxnBonuses(
  totalAttr: TotalAttribute,
  rxnBonus: ReactionBonus,
  vision: Vision,
  infusion: FinalInfusion
) {
  const { transformative, amplifying } = getRxnBonusesFromEM(totalAttr.em);

  for (const rxn of TRANSFORMATIVE_REACTIONS) {
    rxnBonus[rxn] += transformative;
  }
  for (const rxn of AMPLIFYING_REACTIONS) {
    rxnBonus[rxn] += amplifying;
  }
  const meltBonus = toMultiplier(rxnBonus.melt);
  const vapBonus = toMultiplier(rxnBonus.vaporize);

  rxnBonus.melt = meltMult(vision) * meltBonus;
  rxnBonus.vaporize = vaporizeMult(vision) * vapBonus;
  if (infusion.NA !== vision) {
    rxnBonus.na_melt = meltMult(infusion.NA) * meltBonus;
    rxnBonus.na_vaporize = vaporizeMult(infusion.NA) * vapBonus;
  }
}

export default function getBuffedStats(
  char: CharInfo,
  charData: CalcCharData,
  charBuffCtrls: ModifierCtrl[],
  weapon: CalcWeapon,
  subWpBuffCtrls: SubWeaponComplexBuffCtrl,
  art: CalcArtInfo,
  resonance: Resonance,
  party: Party,
  partyData: PartyData,
  customBuffCtrls: CustomBuffCtrl[],
  infusion: FinalInfusion,
  tracker: Tracker
) {
  const wpData = findWeapon(weapon)!;
  const totalAttr = initiateTotalAttrs(char, wpData, weapon, tracker);
  const artAttrs = addArtAttrs(art.pieces, totalAttr, tracker);
  const [attPattBonus, attElmtBonus] = initDamageBonuses();

  addWpSubStat(totalAttr, wpData, weapon.level, tracker);

  const rxnBonus = {} as ReactionBonus;
  for (const rxn of REACTIONS) {
    rxnBonus[rxn] = 0;
  }

  const wrapper1 = { totalAttr, attPattBonus, attElmtBonus, rxnBonus, charData, tracker };
  const wrapper2 = { char, charBuffCtrls, infusion, party };
  const { refi } = weapon;

  applyWpPassiveBuffs(false, wpData, refi, wrapper1, partyData);
  applyArtPassiveBuffs(false, art.sets, wrapper1);
  applyCustomBuffs(wrapper1, customBuffCtrls);
  applyResonanceBuffs(totalAttr, attPattBonus, resonance, tracker);
  applyWpBuffs(wrapper1, weapon.buffCtrls, refi, subWpBuffCtrls, wpData);
  applyArtBuffs(wrapper1, art);
  applyTeammateBuffs(party, partyData, wrapper1, char, infusion);
  applySelfBuffs(false, wrapper1, wrapper2, partyData);

  calcFinalTotalAttrs(totalAttr);
  applyArtPassiveBuffs(true, art.sets, wrapper1);
  applyWpPassiveBuffs(true, wpData, refi, wrapper1, partyData);
  applyWpFinalBuffs(totalAttr, weapon, wpData, tracker);
  applySelfBuffs(true, wrapper1, wrapper2, partyData);
  addArtFinalBuffs(totalAttr, attPattBonus, art, tracker);

  calcFinalRxnBonuses(totalAttr, rxnBonus, charData.vision, infusion);
  return [totalAttr, attPattBonus, attElmtBonus, rxnBonus, artAttrs] as const;
}
