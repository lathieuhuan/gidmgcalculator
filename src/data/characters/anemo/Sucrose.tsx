import type { DataCharacter, Vision } from "@Src/types";
import { Green, Red } from "@Src/styled-components";
import { EModAffect } from "@Src/constants";
import { EModifierSrc, LIGHT_PAs } from "../constants";
import { applyModifier, makeModApplier } from "@Src/calculators/utils";

const Sucrose: DataCharacter = {
  code: 3,
  name: "Sucrose",
  icon: "6/61/Character_Sucrose_Thumb",
  sideIcon: "4/4f/Character_Sucrose_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "anemo",
  weapon: "catalyst",
  stats: [
    [775, 14, 59],
    [1991, 37, 151],
    [2570, 47, 195],
    [3850, 71, 293],
    [4261, 78, 324],
    [4901, 90, 373],
    [5450, 100, 414],
    [6090, 112, 463],
    [6501, 120, 494],
    [7141, 131, 543],
    [7552, 139, 574],
    [8192, 151, 623],
    [8604, 158, 654],
    [9244, 170, 703],
  ],
  bonusStat: { type: "anemo", value: 6 },
  NAsConfig: {
    name: "Wind Spirit Creation",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", baseMult: 33.46 },
        { name: "2-Hit", baseMult: 30.62 },
        { name: "3-Hit", baseMult: 38.45 },
        { name: "4-Hit", baseMult: 47.92 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack", baseMult: 120.16 }] },
    PA: { stats: LIGHT_PAs },
    ES: {
      name: "Astable Anemohypostasis Creation - 6308",
      image: "7/76/Talent_Astable_Anemohypostasis_Creation_-_6308",
      xtraLvAtCons: 3,
      stats: [{ name: "Skill DMG", baseMult: 211.2 }],
      // getExtraStats: () => [{ name: "CD", value: "15s" }],
    },
    EB: {
      name: "Forbidden Creation - Isomer 75 / Type II",
      image: "4/4d/Talent_Forbidden_Creation_-_Isomer_75_Type_II",
      xtraLvAtCons: 5,
      stats: [
        { name: "DoT", baseMult: 148 },
        { name: "Additional Elemental DMG", baseMult: 44 },
      ],
      // getExtraStats: () => [
      //   { name: "Duration", value: "6s" },
      //   { name: "CD", value: "20s" },
      // ],
      energyCost: 80,
    },
  },
  passiveTalents: [
    { name: "Catalyst Conversion", image: "8/8b/Talent_Catalyst_Conversion" },
    { name: "Mollis Favonius", image: "0/02/Talent_Mollis_Favonius" },
    { name: "Astable Invention", image: "7/7e/Talent_Astable_Invention" },
  ],
  constellation: [
    { name: "Clustered Vacuum Field", image: "c/ce/Constellation_Clustered_Vacuum_Field" },
    { name: "Beth: Unbound Form", image: "3/3c/Constellation_Beth_Unbound_Form" },
    { name: "Flawless Alchemistress", image: "c/cb/Constellation_Flawless_Alchemistress" },
    { name: "Alchemania", image: "3/3e/Constellation_Alchemania" },
    { name: "Caution: Standard Flask", image: "5/5e/Constellation_Caution_Standard_Flask" },
    { name: "Chaotic Entropy", image: "b/b1/Constellation_Chaotic_Entropy" },
  ],
  buffs: [
    {
      index: 0,
      src: EModifierSrc.A1,
      desc: () => (
        <>
          When Sucrose triggers a Swirl, all characters in the party with the matching element have
          their <Green>Elemental Mastery</Green> increased by <Green b>50</Green> for 8s.
        </>
      ),
      affect: EModAffect.TEAMMATE,
      applyBuff: makeModApplier("totalAttr", "em", 50),
    },
    {
      index: 1,
      src: EModifierSrc.A4,
      desc: ({ inputs }) => (
        <>
          When Astable Anemohypostasis Creation - 6308 or Forbidden Creation - Isomer 75 / Type II
          hits an opponent, increases all party members' <Green>Elemental Mastery</Green> based on{" "}
          <Green b>20%</Green> of Sucrose's <Green>Elemental Mastery</Green> for 8s.{" "}
          <Red>Elemental Mastery Bonus: {Math.round(+inputs![0] * 0.2)}.</Red>
        </>
      ),
      affect: EModAffect.TEAMMATE,
      inputConfig: {
        labels: ["Elemental Mastery"],
        renderTypes: ["text"],
        initialValues: [0],
        maxValues: [9999],
      },
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        applyModifier(desc, totalAttr, "em", Math.round(+inputs![0] * 0.2), tracker);
      },
    },
    {
      index: 2,
      src: EModifierSrc.C6,
      desc: () => (
        <>
          If Forbidden Creation - Isomer 75 / Type II triggers an Elemental Absorption, all party
          members gain a <Green b>20%</Green> <Green>Elemental DMG Bonus</Green> for the
          corresponding <Green>absorbed element</Green> during its duration.
        </>
      ),
      affect: EModAffect.TEAMMATE,
      inputConfig: {
        labels: ["Element Absorbed"],
        renderTypes: ["anemoable"],
        initialValues: ["pyro"],
      },
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        applyModifier(desc, totalAttr, inputs![0] as Vision, 20, tracker);
      },
    },
  ],
};

export default Sucrose;
