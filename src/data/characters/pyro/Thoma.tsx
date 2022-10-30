import type { DataCharacter } from "@Src/types";
import { Green } from "@Src/styled-components";
import { EModAffect } from "@Src/constants";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { applyPercent } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Calculators/utils";
import { checkAscs, checkCons, talentBuff } from "../utils";
import { NCPA_PERCENTS } from "@Data/constants";

const Thoma: DataCharacter = {
  code: 43,
  name: "Thoma",
  icon: "8/8a/Character_Thoma_Thumb",
  sideIcon: "4/46/Character_Thoma_Side_Icon",
  rarity: 4,
  nation: "inazuma",
  vision: "pyro",
  weapon: "polearm",
  stats: [
    [866, 17, 63],
    [2225, 43, 162],
    [2872, 56, 209],
    [4302, 84, 313],
    [4762, 93, 346],
    [5478, 107, 398],
    [6091, 119, 443],
    [6806, 133, 495],
    [7266, 142, 528],
    [7981, 156, 580],
    [8440, 165, 613],
    [9156, 179, 665],
    [9616, 188, 699],
    [10331, 202, 751],
  ],
  bonusStat: { type: "atk_", value: 6 },
  NAsConfig: {
    name: "Swiftshatter Spear",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", baseMult: 44.39, multType: 4 },
        { name: "2-Hit", baseMult: 43.63, multType: 4 },
        { name: "3-Hit (1/2)", baseMult: 26.79, multType: 4 },
        { name: "4-Hit", baseMult: 67.36, multType: 4 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack", baseMult: 112.75, multType: 4 }] },
    PA: { stats: MEDIUM_PAs },
    ES: {
      name: "Blazing Blessing",
      image: "9/9b/Talent_Blazing_Blessing",
      xtraLvAtCons: 3,
      stats: [
        { name: "Skill DMG", baseMult: 146.4 },
        {
          name: "Shield DMG Absorption",
          notAttack: "shield",
          baseStatType: "hp",
          baseMult: 7.2,
          multType: 2,
          flat: { base: 693, type: 3 },
        },
        {
          name: "Max Shield DMG Absorption",
          notAttack: "shield",
          baseStatType: "hp",
          baseMult: 19.6,
          multType: 2,
          flat: { base: 1887, type: 3 },
        },
      ],
      // getExtraStats: () => [
      //   { name: "Shield Duration", value: "8s" },
      //   { name: "CD", value: "15s" },
      // ],
    },
    EB: {
      name: "Crimson Ooyoroi",
      image: "e/e4/Talent_Crimson_Ooyoroi",
      xtraLvAtCons: 5,
      stats: [
        { name: "Skill DMG", baseMult: 88 },
        {
          name: "Fiery Collapse DMG",
          baseMult: 58,
          getTalentBuff: ({ char, totalAttr }) => {
            const buffValue = applyPercent(totalAttr.hp, 2.2);
            return talentBuff([checkAscs[4](char), "flat", [true, 4], buffValue]);
          },
        },
        {
          name: "Shield DMG Absorption",
          notAttack: "shield",
          baseStatType: "hp",
          baseMult: 1.14,
          multType: 2,
          flat: { base: 110, type: 3 },
        },
      ],
      // getExtraStats: () => [
      //   { name: "Shield Duration", value: "8s" },
      //   { name: "Scorching Ooyoroi Duration", value: "15s" },
      //   { name: "CD", value: "20s" },
      // ],
      energyCost: 80,
    },
  },
  passiveTalents: [
    { name: "Imbricated Armor", image: "4/4b/Talent_Imbricated_Armor" },
    { name: "Flaming Assault", image: "0/03/Talent_Flaming_Assault" },
    { name: "Snap and Swing", image: "1/14/Talent_Snap_and_Swing" },
  ],
  constellation: [
    { name: "A Comrade's Duty", image: "9/9c/Constellation_A_Comrade%27s_Duty" },
    { name: "A Subordinate's Skills", image: "e/e9/Constellation_A_Subordinate%27s_Skills" },
    { name: "Fortified Resolve", image: "9/99/Constellation_Fortified_Resolve" },
    { name: "Long-Term Planning", image: "f/f4/Constellation_Long-Term_Planning" },
    { name: "Raging Wildfire", image: "5/5b/Constellation_Raging_Wildfire" },
    { name: "Burning Heart", image: "0/0f/Constellation_Burning_Heart" },
  ],
  innateBuffs: [
    {
      src: EModSrc.A4,
      desc: () => (
        <>
          <Green>DMG</Green> dealt by Crimson Ooyoroi's <Green>Fiery Collapse</Green> is increased
          by <Green b>2.2%</Green> of Thoma's <Green>Max HP</Green>.
        </>
      ),
      isGranted: checkAscs[4],
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      desc: () => (
        <>
          When your current active character obtains or refreshes a Blazing Barrier, this
          character's <Green>Shield Strength</Green> will increase by <Green b>5%</Green> for 6s.
          <br />
          This effect can be triggered once every 0.3 seconds. Max <Green b>5</Green>{" "}
          <Green>stacks</Green>.
        </>
      ),
      isGranted: checkAscs[1],
      affect: EModAffect.ACTIVE_UNIT,
      inputConfig: {
        selfLabels: ["Stacks"],
        labels: ["Stacks"],
        renderTypes: ["select"],
        initialValues: [1],
        maxValues: [5],
      },
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        applyModifier(desc, totalAttr, "shStr", 5 * (inputs?.[0] || 0), tracker);
      },
    },
    {
      index: 2,
      src: EModSrc.C6,
      desc: () => (
        <>
          When a Blazing Barrier is obtained or refreshed, the <Green>DMG</Green> dealt by all party
          members' <Green>Normal, Charged, and Plunging Attacks</Green> is increased by{" "}
          <Green b>15%</Green> for 6s.
        </>
      ),
      isGranted: checkCons[6],
      affect: EModAffect.PARTY,
      applyBuff: makeModApplier("attPattBonus", [...NCPA_PERCENTS], 15),
    },
  ],
};

export default Thoma;
