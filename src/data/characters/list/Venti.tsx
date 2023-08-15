import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect, VISION_TYPES } from "@Src/constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { BOW_CAs, EModSrc, LIGHT_PAs } from "../constants";
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
  stats: [
    [820, 20, 52],
    [2127, 53, 135],
    [2830, 71, 180],
    [4234, 106, 269],
    [4734, 118, 301],
    [5446, 136, 346],
    [6112, 153, 388],
    [6832, 171, 434],
    [7331, 183, 465],
    [8058, 201, 512],
    [8557, 214, 543],
    [9292, 232, 590],
    [9791, 245, 622],
    [10531, 263, 669],
  ],
  bonusStat: { type: "er_", value: 8 },

  activeTalents: {
    NAs: {
      name: "Divine Marksmanship",
    },
    ES: {
      name: "Skyward Sonnet",
      image: "1/17/Talent_Skyward_Sonnet",
    },
    EB: {
      name: "Wind's Grand Ode",
      image: "3/32/Talent_Wind%27s_Grand_Ode",
    },
  },
  calcList: {
    NA: [
      { name: "1-Hit (1/2)", multFactors: 20.38 },
      { name: "2-Hit", multFactors: 44.38 },
      { name: "3-Hit", multFactors: 52.37 },
      { name: "4-Hit (1/2)", multFactors: 26.06 },
      { name: "5-Hit", multFactors: 50.65 },
      { name: "6-Hit", multFactors: 70.95 },
    ],
    CA: BOW_CAs,
    PA: LIGHT_PAs,
    ES: [
      { name: "Press DMG", multFactors: 276 },
      { name: "Hold DMG", multFactors: 380 },
    ],
    EB: [
      { name: "DoT", multFactors: 37.6 },
      {
        name: "Addition Elemental DMG",
        attElmt: "various",
        multFactors: 18.8,
      },
    ],
  },
  passiveTalents: [
    { name: "Embrace of Winds", image: "7/70/Talent_Embrace_of_Winds" },
    { name: "Stormeye", image: "b/b2/Talent_Stormeye" },
    { name: "Windrider", image: "0/05/Talent_Windrider" },
  ],
  constellation: [
    { name: "Splitting Gales", image: "5/5b/Constellation_Splitting_Gales" },
    { name: "Breeze of Reminiscence", image: "1/1c/Constellation_Breeze_of_Reminiscence" },
    { name: "Ode to Thousand Winds", image: "5/53/Constellation_Ode_to_Thousand_Winds" },
    { name: "Hurricane of Freedom", image: "e/ee/Constellation_Hurricane_of_Freedom" },
    { name: "Concerto dal Cielo", image: "b/b7/Constellation_Concerto_dal_Cielo" },
    { name: "Storm of Defiance", image: "1/1d/Constellation_Storm_of_Defiance" },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.C4,
      affect: EModAffect.SELF,
      description: `When Venti picks up an Elemental Orb or Particle, he receives a {25%}#[b,gr] {Anemo DMG Bonus}#[gr]
      for 10s.`,
      isGranted: checkCons[4],
      applyBuff: makeModApplier("totalAttr", "anemo", 25),
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C2,
      description: `Skyward Sonnet [ES] decreases opponents' {Anemo RES}#[gr] and {Physical RES}#[gr] by {12%}#[b,gr]
      for 10s. Opponents launched by Skyward Sonnet suffer an additional {12%}#[b,gr] {Anemo RES}#[gr] and
      {Physical RES}#[gr] decrease while airborne.`,
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
      description: `Wind's Grand Ode decreases opponents' {Anemo RES}#[gr] and {RES}#[gr] towards the
      {Element absorbed}#[gr] by {20%}#[b,gr].`,
      isGranted: checkCons[6],
      inputConfigs: [
        {
          label: "Element Absorbed",
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