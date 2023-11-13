import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { round, toMult } from "@Src/utils";
import { applyModifier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons, getTalentMultiplier } from "../utils";

const getESBonus = (args: DescriptionSeedGetterArgs) => {
  return getTalentMultiplier({ talentType: "ES", root: 43.2, scale: 5 }, Wriothesley as AppCharacter, args);
};

const Wriothesley: DefaultAppCharacter = {
  code: 76,
  name: "Wriothesley",
  icon: "b/bb/Wriothesley_Icon",
  sideIcon: "d/d0/Wriothesley_Side_Icon",
  rarity: 5,
  nation: "fontaine",
  vision: "cryo",
  weaponType: "catalyst",
  EBcost: 60,
  talentLvBonusAtCons: {
    NAs: 3,
    EB: 5,
  },
  dsGetters: [(args) => `${round(toMult(getESBonus(args)[1]), 3)}`],
  buffs: [
    {
      index: 0,
      src: EModSrc.ES,
      affect: EModAffect.SELF,
      description: `In Chilling Penalty state, when Wriothesley's HP is above 50%, his {Normal Attack DMG}#[gr] will be
      increased by {@0}#[b,gr] times and normal attacks will consume his HP on hit.
      <br />• At {A4}#[g], when Wriothesley's current HP increases or decreases, this state gain 1 stack. Each stack
      increase Wriothesley's {ATK}#[gr] by {6%}#[b,gr]. Max {5}#[r] stacks. At {C2}#[g], each stack also increases
      Darkgold Wolfbite {[EB] DMG}#[gr] by {40%}#[b,gr].`,
      inputConfigs: [
        {
          label: "Stacks (A4)",
          type: "stacks",
          initialValue: 0,
          max: 5,
        },
      ],
      applyBuff: (obj) => {
        const [level, mult] = getESBonus(obj);
        applyModifier(obj.desc + ` Lv.${level}`, obj.attPattBonus, "NA.multPlus", mult, obj.tracker);

        if (checkAscs[4](obj.char)) {
          const stacks = obj.inputs[0] || 0;
          applyModifier(EModSrc.A1, obj.totalAttr, "atk_", 6 * stacks, obj.tracker);

          if (checkCons[2](obj.char)) {
            applyModifier(EModSrc.C2, obj.attPattBonus, "EB.pct_", 40 * stacks, obj.tracker);
          }
        }
      },
    },
    {
      index: 1,
      src: "Gracious Rebuke [A1]",
      isGranted: checkAscs[1],
      affect: EModAffect.SELF,
      description: `When Wriothesley's HP is less than 60%, his next {Charged Attack}#[gr] becomes
      <b>Rebuke: Vaulting Fist</b> dealing {50%}#[b,gr] increased {DMG}#[gr]. Effect cooldown: 5s.
      <br />• At {C1}#[g], this effect triggers when Wriothesley's HP is less than 50% or while he is in the Chilling
      Penalty state, when the fifth normal attack hits. Rebuke: Vaulting Fist deals {200%}#[b,gr] increased {DMG}#[gr].
      Effect cooldown: 2.5s.
      <br/ >• At {C6}#[g], increases Rebuke: Vaulting Fist {CRIT Rate}#[gr] by {10%}#[b,gr] and {CRIT DMG}#[gr] by
      {80%}#[b,gr]`,
      applyBuff: (obj) => {
        applyModifier(obj.desc, obj.attPattBonus, "CA.pct_", checkCons[1](obj.char) ? 200 : 50, obj.tracker);

        if (checkCons[6](obj.char)) {
          applyModifier(EModSrc.C6, obj.attPattBonus, ["CA.cRate_", "CA.cDmg_"], [10, 80], obj.tracker);
        }
      },
    },
    {
      index: 2,
      src: EModSrc.C4,
      isGranted: checkCons[4],
      affect: EModAffect.PARTY,
      description: `When Wriothesley is over healed, if he is on the field, his {ATK SPD}#[gr] will be increased by
      {20%}#[b,gr] for 4s, otherwise all party members' {ATK SPD}#[gr] will be increased by {10%}#[b,gr] for 6s.`,
      applyBuff: (obj) => {
        applyModifier(obj.desc, obj.totalAttr, "naAtkSpd_", obj.fromSelf ? 20 : 10, obj.tracker);
      },
    },
  ],
};

export default Wriothesley as AppCharacter;
