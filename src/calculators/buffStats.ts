import { findArtifactSet, findCharacter, findWeapon } from "@Data/controllers";
import {
  AMPLIFYING_ELEMENTS,
  AMPLIFYING_REACTIONS,
  ATTACK_PATTERNS,
  REACTIONS,
  RESONANCE_INFO,
  TRANSFORMATIVE_REACTIONS,
} from "@Src/constants";
import {
  AllStat,
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
  SkillBonus,
  SkillBonusKey,
  SubWeaponComplexBuffCtrl,
  TotalAttribute,
  Tracker,
  Vision,
  Weapon,
} from "@Src/types";
import { findByIndex, toMultiplier } from "@Src/utils";
import { addArtAttrs, addWpSubStat, initiateTotalAttrs } from "./baseStats";
import { Wrapper1, Wrapper2 } from "./types";
import {
  ampMultiplier,
  applyModifier,
  getRxnBonusesFromEM,
  pushOrMergeTrackerRecord,
} from "./utils";

function applyCustomBuffs(wrapper: Required<Wrapper1>, customBuffs: CustomBuffCtrl[]) {
  for (const { category, type, value } of customBuffs) {
    const desc = "Custom Buff";

    if (category === 2) {
      const skillBonusKey = type as SkillBonusKey;
      wrapper.skillBonuses[skillBonusKey].pct += value;
      pushOrMergeTrackerRecord(wrapper.tracker?.[skillBonusKey], "pct", desc, value);
    } else {
      if (category === 1) {
        const key = type as AllStat;
        wrapper.totalAttrs[key] += value;
      } else {
        const key = type as Reaction;
        wrapper.rxnBonuses[key] += value;
      }
      pushOrMergeTrackerRecord(wrapper.tracker, type as string, desc, value);
    }
  }
}

function applyResonanceBuffs(
  totalAttrs: TotalAttribute,
  skillBonuses: SkillBonus,
  resonance: Resonance,
  tracker: Tracker
) {
  for (const rsn of resonance) {
    if (rsn.activated) {
      const { key, value } = RESONANCE_INFO[rsn.vision];
      const desc = `${rsn.vision} Resonance`;
      applyModifier(desc, totalAttrs, key, value, tracker);

      if (rsn.vision === "geo") {
        applyModifier(desc, skillBonuses, "all.pct", 15, tracker);
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
        const { name, buffs } = findWeapon({ type: type as Weapon, code })!;
        const { applyBuff } = findByIndex(buffs, ctrl.index) || {};
        if (applyBuff) {
          const desc = `${name} activated`;
          applyBuff({ ...wrapper, refi, inputs, desc });
        }
      }
    }
  }
  for (const { activated, index, inputs } of wpBuffCtrls) {
    const { applyBuff } = findByIndex(wpData.buffs, index) || {};
    if (activated && applyBuff) {
      applyBuff({ ...wrapper, refi, inputs, desc: `${wpData.name} activated` });
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
        applyFn({ ...wrapper, ...wrapper2, toSelf: false, selfBuffCtrls: tm.buffCtrls });
      }
    }
  }
}

function applyWpFinalBuffs(
  totalAttrs: TotalAttribute,
  weapon: CalcWeapon,
  wpData: DataWeapon,
  tracker: Tracker
) {
  const { buffCtrls, refi } = weapon;
  for (let ctrl of buffCtrls) {
    if (ctrl.activated) {
      const { applyFinalBuff } = findByIndex(wpData.buffs, ctrl.index) || {};
      if (applyFinalBuff) {
        applyFinalBuff({ totalAttrs, refi, desc: `${wpData.name} activated`, tracker });
      }
    }
  }
}

function addArtFinalBuffs(
  totalAttrs: TotalAttribute,
  skillBonuses: SkillBonus,
  art: CalcArtInfo,
  tracker: Tracker
) {
  for (const ctrl of art.buffCtrls) {
    const { name, buffs } = findArtifactSet({ code: art.sets[0].code })!;
    const { applyFinalBuff } = buffs?.[ctrl.index] || {};

    if (ctrl.activated && applyFinalBuff) {
      const desc = `${name} (self) / 4-Piece activated`;
      applyFinalBuff({ totalAttrs, skillBonuses, desc, tracker });
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

function calcFinalRxnBnes(
  totalAttrs: TotalAttribute,
  rxnBonuses: ReactionBonus,
  vision: Vision,
  infusion: FinalInfusion
) {
  const { transformative, amplifying } = getRxnBonusesFromEM(totalAttrs.em);

  for (const rxn of TRANSFORMATIVE_REACTIONS) {
    rxnBonuses[rxn] += transformative;
  }
  for (const rxn of AMPLIFYING_REACTIONS) {
    rxnBonuses[rxn] += amplifying;
  }
  const meltBonus = toMultiplier(rxnBonuses.melt);
  const vapBonus = toMultiplier(rxnBonuses.vaporize);

  rxnBonuses.melt = ampMultiplier.melt(vision) * meltBonus;
  rxnBonuses.vaporize = ampMultiplier.vaporize(vision) * vapBonus;
  if (infusion.NA !== vision) {
    rxnBonuses.naMelt = ampMultiplier.melt(infusion.NA) * meltBonus;
    rxnBonuses.naVaporize = ampMultiplier.vaporize(infusion.NA) * vapBonus;
  }
}



export default function getBuffedStats(
  char: CharInfo,
  charData: CalcCharData,
  charBuffCtrls: ModifierCtrl[],
  weapon: CalcWeapon,
  subWpBuffCtrls: ModifierCtrl[],
  art: CalcArtInfo,
  resonance: Resonance,
  party: Party,
  partyData: PartyData,
  customBuffCtrls: CustomBuffCtrl[],
  infusion: FinalInfusion,
  tracker: Tracker
) {
  const wpData = findWeapon(weapon)!;
  const totalAttrs = initiateTotalAttrs(char, wpData, weapon, tracker);
  const artAttrs = addArtAttrs(art.pieces, totalAttrs, tracker);
  addWpSubStat(wpData, totalAttrs, weapon.level, tracker);

  const skillBonuses = {} as SkillBonus;
  
  for (const pattern of [...ATTACK_PATTERNS]) {
    skillBonuses[pattern] = {
      cDmg: 0,
      cRate: 0,
      flat: 0,
      pct: 0,
    };
  }
  const rxnBnes = {};
  for (const rxn of REACTIONS) {
    rxnBnes[rxn] = 0;
  }
  const wrapper = { ATTRs, hitBnes, rxnBnes, charData, tracker };

  const wpRfm = weapon.refinement;
  addWpBonuses(false, wpData, wpRfm, wrapper, partyData);
  addArtBonuses(false, art.sets, wrapper);
  // charData is not needed
  addCustomBuffs(wrapper, customBCs);
  addResonanceBuffs(ATTRs, hitBnes, resonance, tracker);
  // rxnBnes is not needed yet
  addWpBuffs(wrapper, weapon.BCs, wpRfm, subWpBCs, wpData);
  addArtBuffs({ ATTRs, hitBnes, tracker }, art);
  addTeammateBuffs(party, partyData, wrapper, char, infusion);
  const wrapper2 = { char, charBCs, infusion, party };
  // charData is not needed yet
  addSelfBuffs(false, wrapper, wrapper2, partyData);

  calcFinalATTRs(ATTRs);
  addArtBonuses(true, art.sets, wrapper);
  addWpBonuses(true, wpData, wpRfm, wrapper, partyData);
  addWpFinalBuffs(ATTRs, weapon, wpData, tracker);
  addSelfBuffs(true, wrapper, wrapper2, partyData);
  addArtFinalBuffs(ATTRs, hitBnes, art, tracker);

  hitBnes.Elemental.pct += ATTRs[charData.vision + " DMG Bonus"];
  hitBnes.Physical.pct += ATTRs["Physical DMG Bonus"];
  calcFinalRxnBnes(ATTRs, rxnBnes, charData.vision, infusion);
  return [ATTRs, hitBnes, rxnBnes, artSBnes];
}

function init