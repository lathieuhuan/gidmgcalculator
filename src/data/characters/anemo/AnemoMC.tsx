import type { DataCharacter, Vision } from "@Src/types";
import { Green } from "@Src/styled-components";
import { EModAffect } from "@Src/constants";
import { EModifierSrc, TRAVELER_INFO, TRAVELLER_NCPAs } from "../constants";
import { applyModifier, makeModApplier } from "@Src/calculators/utils";
import { checkCons } from "../utils";

const AnemoMC: DataCharacter = {
  code: 1,
  name: "Anemo Traveler",
  ...TRAVELER_INFO,
  vision: "anemo",
  NAsConfig: {
    name: "Foreign Ironwind",
    caStamina: 20,
  },
  activeTalents: {
    ...TRAVELLER_NCPAs,
    ES: {
      name: "Palm Vortex",
      image: "0/07/Talent_Palm_Vortex",
      xtraLvAtCons: 5,
      stats: [
        { name: "Initial Cutting", baseMult: 12 },
        { name: "Max Cutting", baseMult: 16.8 },
        { name: "Initial Storm", baseMult: 176 },
        { name: "Max Storm", baseMult: 192 },
      ],
      // getExtraStats: () => [
      //   { name: "Base CD", value: "5s" },
      //   { name: "Max Charging CD", value: "8s" },
      // ],
    },
    EB: {
      name: "Gust Surge",
      image: "9/98/Talent_Gust_Surge",
      xtraLvAtCons: 3,
      stats: [
        { name: "Tornado DMG", baseMult: 80.8 },
        { name: "Additional Elemental DMG", dmgTypes: ["EB", "various"], baseMult: 24.8 },
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
  buffs: [
    {
      index: 0,
      src: EModifierSrc.C2,
      desc: () => (
        <>
          Increases <Green>Energy Recharge</Green> by <Green b>16%</Green>.
        </>
      ),
      isGranted: checkCons[2],
      affect: EModAffect.SELF,
      applyBuff: makeModApplier("totalAttr", "er", 16),
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModifierSrc.C6,
      desc: () => (
        <>
          Targets who take DMG from Gust Surge have their <Green>Anemo RES</Green> decreased by{" "}
          <Green b>20%</Green>.<br />
          If an Elemental Absorption occurred, then their <Green>RES</Green> towards the{" "}
          <Green>corresponding Element</Green> is also decreased by <Green b>20%</Green>.
        </>
      ),
      isGranted: checkCons[6],
      inputConfig: {
        selfLabels: ["Element Absorbed"],
        labels: ["Element Absorbed"],
        renderTypes: ["anemoable"],
        initialValues: ["pyro"],
      },
      applyDebuff: ({ resistReduct, inputs, desc, tracker }) => {
        applyModifier(desc, resistReduct, ["anemo", `${inputs![0]}` as Vision], 20, tracker);
      },
    },
  ],
};

export default AnemoMC;
