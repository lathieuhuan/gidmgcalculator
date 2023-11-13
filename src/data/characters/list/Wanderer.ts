import type { AppCharacter, CharInfo, DefaultAppCharacter, PartyData } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { findByIndex, round, toMult } from "@Src/utils";
import { applyModifier, finalTalentLv } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons, genExclusiveBuff } from "../utils";

const getESBonus = (char: CharInfo, partyData: PartyData) => {
  const level = finalTalentLv({
    talentType: "ES",
    char,
    charData: Wanderer as AppCharacter,
    partyData,
  });
  return {
    NA: 32.98 * TALENT_LV_MULTIPLIERS[5][level],
    CA: 26.39 * TALENT_LV_MULTIPLIERS[5][level],
  };
};

const Wanderer: DefaultAppCharacter = {
  code: 63,
  name: "Wanderer",
  icon: "f/f8/Wanderer_Icon",
  sideIcon: "6/67/Wanderer_Side_Icon",
  rarity: 5,
  nation: "sumeru",
  vision: "anemo",
  weaponType: "catalyst",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  dsGetters: [
    (args) => `${round(toMult(getESBonus(args.char, args.partyData).NA), 3)}`,
    (args) => `${round(toMult(getESBonus(args.char, args.partyData).CA), 3)}`,
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.ES,
      affect: EModAffect.SELF,
      description: `Increases {Normal Attack DMG}#[k] by {@0}#[v] times and {Charged Attack DMG}#[k] by {@1}#[v]
      times.
      <br />• At {C1}#[ms], increases {Normal and Charged Attack SPD}#[k] by {10%}#[v], increases
      {Wind Arrow DMG}#[k] [~A4] by {25%}#[v] of {ATK}#[k].`,
      applyBuff: ({ totalAttr, attPattBonus, calcItemBuffs, char, partyData, desc, tracker }) => {
        const { NA, CA } = getESBonus(char, partyData);
        applyModifier(desc, attPattBonus, ["NA.multPlus", "CA.multPlus"], [NA, CA], tracker);

        if (checkCons[1](char)) {
          applyModifier(desc, totalAttr, ["naAtkSpd_", "caAtkSpd_"], 10, tracker);
          calcItemBuffs.push(genExclusiveBuff(EModSrc.C1, "NA.0", "mult_", 25));
        }
      },
    },
    {
      index: 1,
      src: EModSrc.A1,
      affect: EModAffect.SELF,
      description: `If Hanega: Song of the Wind [ES] comes into contact with:
      <br />• Hydro: {Kuugoryoku Point cap}#[k] increases by {20}#[v].
      <br />• Pyro: {ATK}#[k] increases by {30%}#[v].
      <br />• Cryo: {CRIT Rate}#[k] increases by {20%}#[v].`,
      isGranted: checkAscs[1],
      inputConfigs: [
        {
          label: "Infused element 1",
          type: "select",
          initialValue: 0,
          options: ["Pyro", "Cryo", "Hydro"],
        },
        {
          label: "Infused element 2",
          type: "select",
          initialValue: 0,
          options: ["Pyro", "Cryo", "Hydro"],
        },
        {
          label: "Random infused element (C4)",
          type: "select",
          initialValue: 0,
          options: ["Pyro", "Cryo", "Hydro"],
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        if (inputs.includes(0)) {
          applyModifier(desc, totalAttr, "atk_", 30, tracker);
        }
        if (inputs.includes(1)) {
          applyModifier(desc, totalAttr, "cRate_", 20, tracker);
        }
      },
    },
    {
      index: 2,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      description: `When in the Windfavored State [~ES], Kyougen: Five Ceremonial Plays {[EB] DMG}#[k] will be
      increased by {4%}#[v] per point of {difference between the max and the current amount of Kuugoryoku Points}#[k]
      when using this skill. Maximum {200%}#[m].`,
      isGranted: checkCons[2],
      inputConfigs: [
        {
          label: "Current Kuugoryoku Points",
          type: "text",
          max: 120,
        },
      ],
      applyBuff: (obj) => {
        const isHydroInfusedES = checkCons[4](obj.char)
          ? findByIndex(obj.charBuffCtrls, 1)?.inputs?.includes(2)
          : false;
        const difference = (isHydroInfusedES ? 120 : 100) - (obj.inputs[0] || 0);
        const buffValue = Math.min(Math.max(difference, 0) * 4, 200);
        applyModifier(obj.desc, obj.attPattBonus, "EB.pct_", buffValue, obj.tracker);
      },
    },
  ],
};

export default Wanderer as AppCharacter;
