import type { DataCharacter } from "@Src/types";
import { Green } from "@Components";
import { EModSrc, TRAVELER_INFO, TRAVELLER_NCPAs } from "../constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { checkCons } from "../utils";
import { VISION_TYPES } from "@Src/constants";

const AnemoMC: DataCharacter = {
  code: 1,
  name: "Anemo Traveler",
  ...TRAVELER_INFO,
  vision: "anemo",
  NAsConfig: {
    name: "Foreign Ironwind",
  },
  isReverseXtraLv: true,
  activeTalents: {
    ...TRAVELLER_NCPAs,
    ES: {
      name: "Palm Vortex",
      image: "0/07/Talent_Palm_Vortex",
      stats: [
        { name: "Initial Cutting", multFactors: 12 },
        { name: "Max Cutting", multFactors: 16.8 },
        { name: "Initial Storm", multFactors: 176 },
        { name: "Max Storm", multFactors: 192 },
      ],
      // getExtraStats: () => [
      //   { name: "Base CD", value: "5s" },
      //   { name: "Max Charging CD", value: "8s" },
      // ],
    },
    EB: {
      name: "Gust Surge",
      image: "9/98/Talent_Gust_Surge",
      stats: [
        { name: "Tornado DMG", multFactors: 80.8 },
        { name: "Additional Elemental DMG", attElmt: "various", multFactors: 24.8 },
      ],
      // getExtraStats: () => [
      //   { name: "Duration", value: "6s" },
      //   { name: "CD", value: "15" },
      // ],
      energyCost: 60,
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
      desc: () => (
        <>
          Increases <Green>Energy Recharge</Green> by <Green b>16%</Green>.
        </>
      ),
      isGranted: checkCons[2],
      applyBuff: makeModApplier("totalAttr", "er_", 16),
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C6,
      desc: () => (
        <>
          Gust Surge [EB] decreases targets' <Green>Anemo RES</Green> by <Green b>20%</Green>. Also decreases{" "}
          <Green>RES</Green> towards the <Green>absorbed Element</Green> (if any) by <Green b>20%</Green>.
        </>
      ),
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

export default AnemoMC;
