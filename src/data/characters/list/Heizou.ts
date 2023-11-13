import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkCons } from "../utils";

const Heizou: DefaultAppCharacter = {
  code: 53,
  name: "Heizou",
  icon: "2/20/Shikanoin_Heizou_Icon",
  sideIcon: "c/ca/Shikanoin_Heizou_Side_Icon",
  rarity: 4,
  nation: "inazuma",
  vision: "anemo",
  weaponType: "catalyst",
  EBcost: 40,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  buffs: [
    {
      index: 0,
      src: EModSrc.A4,
      affect: EModAffect.TEAMMATE,
      description: `When Heartstopper Strike [ES] hits an opponent, increases all party members' (excluding Heizou)
      {Elemental Mastery}#[k] by {80}#[v] for 10s.`,
      applyBuff: makeModApplier("totalAttr", "em", 80),
    },
    {
      index: 1,
      src: EModSrc.C1,
      affect: EModAffect.SELF,
      description: `For 5s after Heizou takes the field, his {Normal Attack SPD}#[k] is increased by {15%}#[v].`,
      isGranted: checkCons[1],
      applyBuff: makeModApplier("totalAttr", "naAtkSpd_", 15),
    },
    {
      index: 2,
      src: EModSrc.C6,
      affect: EModAffect.SELF,
      description: `Each Declension stack increases Heartstopper Strike {[ES] CRIT Rate}#[k] by {4%}#[v]. At 4
      stacks, Heartstoppper Strike's {[ES] CRIT DMG}#[k] is increased by {32%}#[v]`,
      isGranted: checkCons[6],
      inputConfigs: [
        {
          type: "stacks",
          max: 4,
        },
      ],
      applyBuff: ({ attPattBonus, inputs, desc, tracker }) => {
        const stacks = inputs[0] || 0;

        if (stacks !== 4) {
          applyModifier(desc, attPattBonus, "ES.cRate_", 4 * stacks, tracker);
        } else {
          applyModifier(desc, attPattBonus, ["ES.cRate_", "ES.cDmg_"], [4 * stacks, 32], tracker);
        }
      },
    },
  ],
};

export default Heizou as AppCharacter;
