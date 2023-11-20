import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { ATTACK_ELEMENTS } from "@Src/constants";
import { applyModifier } from "@Src/utils/calculation";

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
  debuffs: [
    {
      index: 0,
      src: "Jade Shield",
      description: `Jade Shield decreases {Elemental RES}#[k] and {Physical RES}#[k] of opponents in a small AoE
      by {20%}#[v]. Cannot be stacked.`,
      applyDebuff: ({ resistReduct, desc, tracker }) => {
        applyModifier(desc, resistReduct, [...ATTACK_ELEMENTS], 20, tracker);
      },
    },
  ],
};

export default Zhongli as AppCharacter;
