import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { ATTACK_ELEMENTS, EModAffect } from "@Src/constants";
import { applyPercent } from "@Src/utils";
import { AttackPatternPath, applyModifier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs } from "../utils";

const Zhongli: DefaultAppCharacter = {
  code: 25,
  name: "Zhongli",
  icon: "a/a6/Zhongli_Icon",
  sideIcon: "6/68/Zhongli_Side_Icon",
  rarity: 5,
  nation: "liyue",
  vision: "geo",
  weaponType: "polearm",
  EBcost: 40,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  innateBuffs: [
    {
      src: EModSrc.A4,
      description: `• {Normal Attack, Charged Attack, and Plunging Attack DMG}#[gr] increased by {1.39%}#[b,gr] of
      {Max HP}#[gr].
      <br />• Dominus Lapidis Stone Stele, resonance, and hold {[ES] DMG}#[gr] increased by {1.9%}#[b,gr] of
      {Max HP}#[gr].
      <br />• Planet Befall {[EB] DMG}#[gr] increased by {33%}#[b,gr] of {Max HP}#[gr].`,
      isGranted: checkAscs[4],
      applyFinalBuff: ({ totalAttr, attPattBonus, desc, tracker }) => {
        const fields: AttackPatternPath[] = ["NA.flat", "CA.flat", "PA.flat", "ES.flat", "EB.flat"];
        const buffValues = [1.39, 1.39, 1.39, 1.9, 33].map((mult) => applyPercent(totalAttr.hp, mult));
        applyModifier(desc, attPattBonus, fields, buffValues, tracker);
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.ACTIVE_UNIT,
      description: `When Jade Shield takes DMG, the characters have their {Shield Strength}#[gr] increased by
      {5%}#[b,gr] until the Jade Shield disappears. Max {5}#[r] stacks.`,
      isGranted: checkAscs[1],
      inputConfigs: [
        {
          type: "stacks",
          max: 5,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        applyModifier(desc, totalAttr, "shieldS_", 5 * (inputs[0] || 0), tracker);
      },
    },
  ],
  debuffs: [
    {
      index: 0,
      src: "Jade Shield",
      description: `Jade Shield decreases {Elemental RES}#[gr] and {Physical RES}#[gr] of opponents in a small AoE
      by {20%}#[b,gr]. Cannot be stacked.`,
      applyDebuff: ({ resistReduct, desc, tracker }) => {
        applyModifier(desc, resistReduct, [...ATTACK_ELEMENTS], 20, tracker);
      },
    },
  ],
};

export default Zhongli as AppCharacter;
