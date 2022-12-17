import type { DataCharacter } from "@Src/types";
import { Green } from "@Components/atoms";
import { EModAffect } from "@Src/constants";
import { EModSrc, TRAVELER_INFO, TRAVELLER_NCPAs } from "../constants";
import { applyModifier, makeModApplier } from "@Calculators/utils";
import { checkAscs, checkCons } from "../utils";

const ElectroMC: DataCharacter = {
  code: 46,
  name: "Electro Traveler",
  ...TRAVELER_INFO,
  vision: "electro",
  NAsConfig: {
    name: "Foreign Thundershock",
  },
  activeTalents: {
    ...TRAVELLER_NCPAs,
    ES: {
      name: "Lightning Blade",
      image: "0/03/Talent_Lightning_Blade",
      xtraLvAtCons: 5,
      stats: [{ name: "Skill DMG", multBase: 78.66 }],
      // getExtraStats: (lv) => [
      //   {
      //     name: "Energy Regeneration	",
      //     value: Math.min(2.5 + Math.ceil(lv / 3) * 0.5, 4) + " per Amulet",
      //   },
      //   { name: "Energy Recharge Increase", value: "20%" },
      //   { name: "Duration", value: "6s" },
      //   { name: "Abundance Amulet Duration", value: "15s" },
      //   { name: "CD", value: "13.5s" },
      // ],
    },
    EB: {
      name: "Bellowing Thunder",
      image: "a/a7/Talent_Bellowing_Thunder",
      xtraLvAtCons: 3,
      stats: [
        { name: "Skill DMG", multBase: 114.4 },
        { name: "Falling Thunder", multBase: 32.8 },
      ],
      getExtraStats: (lv) => [
        { name: "Energy Regeneration", value: Math.min((7 + Math.ceil(lv / 3) * 1) / 10, 1) },
        { name: "Duration", value: "12s" },
        { name: "CD", value: "20s" },
      ],
      energyCost: 80,
    },
  },
  passiveTalents: [
    { name: "Thunderflash", image: "1/16/Talent_Thunderflash" },
    { name: "Resounding Roar", image: "2/26/Talent_Resounding_Roar" },
  ],
  constellation: [
    {
      name: "Spring Thunder of Fertility",
      image: "2/2f/Constellation_Spring_Thunder_of_Fertility",
    },
    { name: "Violet Vehemence", image: "8/8f/Constellation_Violet_Vehemence" },
    { name: "Distant Crackling", image: "c/c0/Constellation_Distant_Crackling" },
    { name: "Fickle Cloudstrike", image: "8/84/Constellation_Fickle_Cloudstrike" },
    { name: "Clamor in the Wilds", image: "8/80/Constellation_Clamor_in_the_Wilds" },
    { name: "World-Shaker", image: "7/76/Constellation_World-Shaker" },
  ],
  innateBuffs: [
    {
      src: EModSrc.A4,
      desc: () => (
        <>
          Increases the <Green>Energy Recharge</Green> effect granted by Lightning Blade's Abundance
          Amulet by <Green b>10%</Green> of the Traveler's <Green>Energy Recharge</Green>.
        </>
      ),
      isGranted: checkAscs[4],
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.ES,
      desc: () => (
        <>
          Increases <Green>Energy Recharge</Green> during the Abundance Amulet's duration.
        </>
      ),
      affect: EModAffect.ONE_UNIT,
      inputConfigs: [
        { label: "A4 Passive Talent", type: "check", for: "teammate" },
        { label: "Energy Recharge", type: "text", initialValue: 100, max: 999, for: "teammate" },
      ],
      applyBuff: ({ totalAttr, char, inputs, toSelf, desc, tracker }) => {
        let buffValue = 20;
        const boosted = toSelf ? checkAscs[4](char) : inputs[0] === 1;

        if (boosted) {
          const ER = toSelf ? totalAttr.er : inputs[1] || 0;
          buffValue += Math.round(ER) / 10;
        }
        applyModifier(desc, totalAttr, "er", buffValue, tracker);
      },
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C2,
      desc: () => (
        <>
          When Falling Thunder created by Bellowing Thunder hits an opponent, it will decrease their{" "}
          <Green>Electro RES</Green> by <Green b>15%</Green> for 8s.
        </>
      ),
      isGranted: checkCons[2],
      applyDebuff: makeModApplier("resistReduct", "electro", 15),
    },
  ],
};

export default ElectroMC;
