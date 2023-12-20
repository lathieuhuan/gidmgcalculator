import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect, VISION_TYPES } from "@Src/constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkCons } from "../utils";

const Venti: DefaultAppCharacter = {
  code: 22,
  name: "Venti",
  icon: "f/f1/Venti_Icon",
  sideIcon: "0/00/Venti_Side_Icon",
  rarity: 5,
  nation: "mondstadt",
  vision: "anemo",
  weaponType: "bow",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  buffs: [
    {
      index: 0,
      src: EModSrc.C4,
      affect: EModAffect.SELF,
      description: `When Venti picks up an Elemental Orb or Particle, he receives a {25%}#[v] {Anemo DMG Bonus}#[k]
      for 10s.`,
      isGranted: checkCons[4],
      applyBuff: makeModApplier("totalAttr", "anemo", 25),
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C2,
      description: `Skyward Sonnet [ES] decreases opponents' {Anemo RES}#[k] and {Physical RES}#[k] by {12%}#[v]
      for 10s. Opponents launched by Skyward Sonnet suffer an additional {12%}#[v] {Anemo RES}#[k] and
      {Physical RES}#[k] decrease while airborne.`,
      isGranted: checkCons[2],
      inputConfigs: [
        {
          label: "Launch target",
          type: "check",
        },
      ],
      applyDebuff: ({ resistReduct, inputs, desc, tracker }) => {
        const buffValue = 12 * (inputs[0] ? 2 : 1);
        applyModifier(desc, resistReduct, ["phys", "anemo"], buffValue, tracker);
      },
    },
    {
      index: 2,
      src: EModSrc.C6,
      description: `Wind's Grand Ode decreases opponents' {Anemo RES}#[k] and {RES}#[k] towards the
      {Element absorbed}#[k] by {20%}#[v].`,
      isGranted: checkCons[6],
      inputConfigs: [
        {
          label: "Element absorbed",
          type: "anemoable",
        },
      ],
      applyDebuff: ({ resistReduct, inputs, desc, tracker }) => {
        const elmtIndex = inputs[0] || 0;
        applyModifier(desc, resistReduct, ["anemo", VISION_TYPES[elmtIndex]], 20, tracker);
      },
    },
  ],
};

export default Venti as AppCharacter;
