import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { VISION_TYPES } from "@Src/constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc, TRAVELER_INFO, TRAVELLER_NCPAs } from "../constants";
import { checkCons } from "../utils";

const AnemoMC: DefaultAppCharacter = {
  code: 1,
  name: "Anemo Traveler",
  ...TRAVELER_INFO,
  vision: "anemo",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  calcList: {
    ...TRAVELLER_NCPAs,
    ES: [
      { name: "Initial Cutting", multFactors: 12 },
      { name: "Max Cutting", multFactors: 16.8 },
      { name: "Initial Storm", multFactors: 176 },
      { name: "Max Storm", multFactors: 192 },
    ],
    EB: [
      { name: "Tornado DMG", multFactors: 80.8 },
      {
        name: "Additional Elemental DMG",
        attElmt: "various",
        multFactors: 24.8,
      },
    ],
  },
  activeTalents: {
    NAs: {
      name: "Foreign Ironwind",
    },
    ES: {
      name: "Palm Vortex",
      image: "0/07/Talent_Palm_Vortex",
    },
    EB: {
      name: "Gust Surge",
      image: "9/98/Talent_Gust_Surge",
    },
  },

  passiveTalents: [
    { name: "Slitting Wind", image: "2/22/Talent_Slitting_Wind" },
    { name: "Second Wind", image: "5/5e/Talent_Second_Wind" },
  ],
  constellation: [
    { name: "Raging Vortex", image: "6/67/Constellation_Raging_Vortex" },
    { name: "Uprising Whirlwind", image: "d/d4/Constellation_Uprising_Whirlwind" },
    { name: "Sweeping Gust", image: "c/c6/Constellation_Sweeping_Gust" },
    { name: "Cherishing Breezes", image: "6/6e/Constellation_Cherishing_Breezes" },
    { name: "Vortex Stellaris", image: "9/98/Constellation_Vortex_Stellaris" },
    { name: "Intertwined Winds", image: "8/87/Constellation_Intertwined_Winds" },
  ],
  innateBuffs: [
    {
      src: EModSrc.C2,
      description: `Increases {Energy Recharge}#[gr] by {16%}#[b,gr].`,
      isGranted: checkCons[2],
      applyBuff: makeModApplier("totalAttr", "er_", 16),
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C6,
      description: `Gust Surge [EB] decreases targets' {Anemo RES}#[gr] by {20%}#[b,gr]. Also decreases {RES}#[gr] towards the
      {absorbed Element}#[gr] (if any) by {20%}#[b,gr].`,
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

export default AnemoMC as AppCharacter;
