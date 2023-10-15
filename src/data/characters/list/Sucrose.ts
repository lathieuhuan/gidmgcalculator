import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect, VISION_TYPES } from "@Src/constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkCons } from "../utils";

const Sucrose: DefaultAppCharacter = {
  code: 3,
  name: "Sucrose",
  icon: "0/0e/Sucrose_Icon",
  sideIcon: "9/98/Sucrose_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "anemo",
  weaponType: "catalyst",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.TEAMMATE,
      description: `When Sucrose triggers a Swirl, all characters in the party with the matching element (excluding Sucrose) have
      their {Elemental Mastery}#[gr] increased by {50}#[b,gr] for 8s.`,
      applyBuff: makeModApplier("totalAttr", "em", 50),
    },
    {
      index: 1,
      src: EModSrc.A4,
      affect: EModAffect.TEAMMATE,
      description: `When Astable Anemohypostasis Creation - 6308 [ES] or Forbidden Creation - Isomer 75 / Type II [EB]
      hits an opponent, increases all party members' (excluding Sucrose) {Elemental Mastery}#[gr] based on {20%}#[b,gr]
      of Sucrose's {Elemental Mastery}#[gr] for 8s.`,
      inputConfigs: [
        {
          label: "Elemental Mastery",
          type: "text",
          max: 9999,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        applyModifier(desc, totalAttr, "em", Math.round((inputs[0] || 0) * 0.2), tracker);
      },
    },
    {
      index: 2,
      src: EModSrc.C6,
      affect: EModAffect.PARTY,
      description: `If Forbidden Creation - Isomer 75 / Type II [EB] triggers an Elemental Absorption, all party
      members gain a {20%}#[b,gr] {Elemental DMG Bonus}#[gr] for the corresponding {absorbed element}#[gr] during its
      duration.`,
      isGranted: checkCons[6],
      inputConfigs: [
        {
          label: "Element absorbed",
          type: "anemoable",
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        const elmtIndex = inputs[0] || 0;
        applyModifier(desc, totalAttr, VISION_TYPES[elmtIndex], 20, tracker);
      },
    },
  ],
};

export default Sucrose as AppCharacter;
