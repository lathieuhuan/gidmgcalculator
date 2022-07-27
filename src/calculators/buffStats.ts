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
  FinalInfusion,
  ModifierCtrl,
  Party,
  PartyData,
  Reaction,
  ReactionBonus,
  ResonancePair,
  SubArtModCtrl,
  SubWeaponComplexBuffCtrl,
  Tracker,
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
import { current } from "@reduxjs/toolkit";

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
      let applyFn: Function | undefined;

      if (!isFinal && buff.applyBuff) {
        applyFn = buff.applyBuff;
      } else if (isFinal && buff.applyFinalBuff) {
        applyFn = buff.applyFinalBuff;
      } else {
        continue;
      }
      const desc = `Self / ${buff.src}`;
      applyFn({ ...wrapper, ...wrapper2, partyData, inputs, toSelf: true, desc });
    }
  }
}

export default function getBuffedStats(
  char: CharInfo,
  charData: CalcCharData,
  charBuffCtrls: ModifierCtrl[],
  weapon: CalcWeapon,
  wpBuffCtrls: ModifierCtrl[],
  subWpComplexBuffCtrls: SubWeaponComplexBuffCtrl,
  artInfo: CalcArtInfo,
  artBuffCtrls: ModifierCtrl[],
  subArtBuffCtrls: SubArtModCtrl[],
  resonance: ResonancePair[],
  party: Party,
  partyData: PartyData,
  customBuffCtrls: CustomBuffCtrl[],
  infusion: FinalInfusion,
  tracker: Tracker
) {
  const wpData = findWeapon(weapon)!;
  const totalAttr = initiateTotalAttrs(char, wpData, weapon, tracker);
  const artAttrs = addArtAttrs(artInfo.pieces, totalAttr, tracker);

  // INIT ATTACK DAMAGE BONUSES
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

  // INIT REACTION BONUS
  const rxnBonus = {} as ReactionBonus;
  for (const rxn of REACTIONS) {
    rxnBonus[rxn] = 0;
  }

  const wrapper1 = { totalAttr, attPattBonus, attElmtBonus, rxnBonus, charData, tracker };
  const wrapper2 = { char, charBuffCtrls, infusion, party };
  const { refi } = weapon;

  addWpSubStat(totalAttr, wpData, weapon.level, tracker);
  applyWpPassiveBuffs(false, wpData, refi, wrapper1, partyData);
  applyArtPassiveBuffs(false, artInfo.sets, wrapper1);

  // APPLY CUSTOM BUFFS
  for (const { category, type, value } of customBuffCtrls) {
    if (category === 2) {
      const key = type as AttackPatternBonusKey;
      attPattBonus[key].pct += value;
      pushOrMergeTrackerRecord(tracker?.[key], "pct", "Custom Buff", value);
    } else {
      if (category < 2) {
        const key = type as AttributeStat;
        totalAttr[key] += value;
      } else {
        const key = type as Reaction;
        rxnBonus[key] += value;
      }
      pushOrMergeTrackerRecord(tracker, type as string, "Custom Buff", value);
    }
  }

  // APPLY RESONANCE BUFFS
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

  // APPLY WEAPON BUFFS
  for (const [type, ctrls] of Object.entries(subWpComplexBuffCtrls)) {
    for (const ctrl of ctrls) {
      if (ctrl.activated) {
        const { code, refi, inputs } = ctrl;
        const { name, buffs } = findWeapon({ type: type as Weapon, code }) || {};
        if (buffs) {
          const { applyBuff } = findByIndex(buffs, ctrl.index) || {};
          if (applyBuff) {
            const desc = `${name} activated`;
            applyBuff({ ...wrapper1, refi, inputs, desc });
          } else {
            console.log(`weapon buff #${ctrl.index} of weapon #${code} not found`);
          }
        } else {
          console.log(`weapon #${code} not found`);
        }
      }
    }
  }
  for (const { activated, index, inputs } of wpBuffCtrls) {
    if (wpData.buffs) {
      const { applyBuff } = findByIndex(wpData.buffs, index) || {};
      if (activated && applyBuff) {
        applyBuff({ ...wrapper1, refi, inputs, desc: `${wpData.name} activated` });
      }
    } else {
      console.log(`buffs of main weapon not found`);
    }
  }

  // APPLY ARTIFACT BUFFS
  for (const { activated, code, index, inputs } of subArtBuffCtrls) {
    if (activated) {
      const { name, buffs } = findArtifactSet({ code })!;
      const desc = `${name} / 4-Piece activated`;
      buffs![index].applyBuff!({ ...wrapper1, inputs, desc });
    }
  }
  for (const { index, activated, inputs } of artBuffCtrls) {
    const { name, buffs } = findArtifactSet({ code: artInfo.sets[0].code })!;
    const { applyBuff } = buffs![index];

    if (activated && applyBuff) {
      const desc = `${name} (self) / 4-Piece activated`;
      applyBuff({ ...wrapper1, inputs, desc });
    }
  }

  // APPPLY TEAMMATE BUFFS
  for (const teammate of party) {
    if (!teammate) continue;
    const { buffs = [] } = findCharacter(teammate) || {};

    for (const { index, activated, inputs } of teammate.buffCtrls) {
      const buff = findByIndex(buffs, index);
      if (!buff) continue;

      const applyFn = buff.applyBuff || buff.applyFinalBuff;
      if (activated && applyFn) {
        const desc = `${teammate} / ${buff.src}`;
        const wrapper3 = { char, inputs, infusion, party, partyData, desc };
        applyFn({ ...wrapper1, ...wrapper3, toSelf: false, charBuffCtrls: teammate.buffCtrls });
      }
    }
  }

  applySelfBuffs(false, wrapper1, wrapper2, partyData);
  calcFinalTotalAttrs(totalAttr);

  applyArtPassiveBuffs(true, artInfo.sets, wrapper1);
  applyWpPassiveBuffs(true, wpData, refi, wrapper1, partyData);

  // APPLY WEAPON FINAL BUFFS
  for (let ctrl of wpBuffCtrls) {
    if (ctrl.activated && wpData.buffs) {
      const { applyFinalBuff } = findByIndex(wpData.buffs, ctrl.index) || {};
      if (applyFinalBuff) {
        applyFinalBuff({ totalAttr, refi, desc: `${wpData.name} activated`, tracker });
      }
    } else if (!wpData.buffs) {
      console.log(`final buffs of main weapon not found`);
    }
  }

  applySelfBuffs(true, wrapper1, wrapper2, partyData);

  // APPLY ARTIFACT FINAL BUFFS
  for (const ctrl of artBuffCtrls) {
    const { name, buffs } = findArtifactSet({ code: artInfo.sets[0].code })!;
    const { applyFinalBuff } = buffs?.[ctrl.index] || {};

    if (ctrl.activated && applyFinalBuff) {
      const desc = `${name} (self) / 4-Piece activated`;
      applyFinalBuff({ totalAttr, attPattBonus, desc, tracker });
    }
  }

  // CALCULATE FINAL REACTION BONUSES
  const { transformative, amplifying } = getRxnBonusesFromEM(totalAttr.em);
  const { vision } = charData;

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
    rxnBonus.infusion_melt = meltMult(infusion.NA) * meltBonus;
    rxnBonus.infusion_vaporize = vaporizeMult(infusion.NA) * vapBonus;
  }

  return [totalAttr, attPattBonus, attElmtBonus, rxnBonus, artAttrs] as const;
}
