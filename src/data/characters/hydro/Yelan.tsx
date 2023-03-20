import type { DataCharacter } from "@Src/types";
import { Green, Rose } from "@Components/atoms";
import { EModAffect } from "@Src/constants";
import { BOW_CAs, EModSrc, LIGHT_PAs } from "../constants";
import { countVision } from "@Src/utils";
import { applyModifier } from "@Src/utils/calculation";
import { checkAscs, checkCons } from "../utils";

const Yelan: DataCharacter = {
  code: 51,
  name: "Yelan",
  // icon: "a/a8/Character_Yelan_Thumb",
  icon: "d/d3/Yelan_Icon",
  sideIcon: "9/9f/Yelan_Side_Icon",
  rarity: 5,
  nation: "liyue",
  vision: "hydro",
  weaponType: "bow",
  stats: [
    [1125, 19, 43],
    [2918, 49, 111],
    [3883, 66, 147],
    [5810, 98, 220],
    [6495, 110, 246],
    [7472, 126, 283],
    [8386, 142, 318],
    [9374, 158, 355],
    [10059, 170, 381],
    [11056, 187, 419],
    [11741, 198, 445],
    [12749, 215, 483],
    [13434, 227, 509],
    [14450, 244, 548],
  ],
  bonusStat: { type: "cRate_", value: 4.8 },
  NAsConfig: {
    name: "Stealthy Bowshot",
  },
  isReverseXtraLv: true,
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: 40.68 },
        { name: "2-Hit", multFactors: 39.04 },
        { name: "3-Hit", multFactors: 51.6 },
        { name: "4-Hit (1/2)", multFactors: 32.51 },
      ],
    },
    CA: {
      stats: [
        ...BOW_CAs,
        {
          name: "Breakthrough Barb DMG",
          subAttPatt: "FCA",
          multFactors: { root: 11.58, attributeType: "hp" },
        },
        {
          name: "Special Breakthrough Barb DMG (C6)",
          subAttPatt: "FCA",
          multFactors: { root: 18, attributeType: "hp" },
          isNotOfficial: true,
        },
      ],
      multScale: 2,
    },
    PA: { stats: LIGHT_PAs },
    ES: {
      name: "Lingering Lifeline",
      image: "5/59/Talent_Lingering_Lifeline",
      stats: [{ name: "Skill DMG", multFactors: { root: 22.61, attributeType: "hp" } }],
      // getExtraStats: () => [
      //   { name: "Max Duration (Hold)", value: "3s" },
      //   { name: "CD", value: "10" },
      // ],
    },
    EB: {
      name: "Depth-Clarion Dice",
      image: "b/bd/Talent_Depth-Clarion_Dice",
      stats: [
        { name: "Skill DMG", multFactors: 7.31 },
        { name: "Exquisite Throw DMG (1/3)", multFactors: 4.87 },
        {
          name: "Additional Water Arrow DMG (C2)",
          multFactors: { root: 14, scale: 0 },
        },
      ],
      multAttributeType: "hp",
      // otherStats: () => [
      //   { name: "Duration", value: "15s" },
      //   { name: "CD", value: "18s" },
      // ],
      energyCost: 70,
    },
  },
  passiveTalents: [
    { name: "Turn Control", image: "4/42/Talent_Turn_Control" },
    { name: "Adapt With Ease", image: "9/9d/Talent_Adapt_With_Ease" },
    { name: "Necessary Calculation", image: "b/bd/Talent_Necessary_Calculation" },
  ],
  constellation: [
    { name: "Enter the Plotters", image: "a/af/Constellation_Enter_the_Plotters" },
    { name: "Taking All Comers", image: "8/8e/Constellation_Taking_All_Comers" },
    {
      name: "Beware the Trickster's Dice",
      image: "e/ea/Constellation_Beware_the_Trickster%27s_Dice",
    },
    { name: "Bait-and-Switch", image: "8/83/Constellation_Bait-and-Switch" },
    { name: "Dealer's Sleight", image: "6/6f/Constellation_Dealer%27s_Sleight" },
    { name: "Winner Take All", image: "5/59/Constellation_Winner_Takes_All" },
  ],
  innateBuffs: [
    {
      src: EModSrc.A1,
      desc: ({ charData, partyData }) => {
        const visionCount = countVision(partyData, charData);
        const n = Object.keys(visionCount).length;
        return (
          <>
            When the party has 1/2/3/4 Elemental Types, Yelan's <Green>Max HP</Green> is increased by{" "}
            <Green className={n === 1 ? "" : "opacity-50"}>6%</Green>/
            <Green className={n === 2 ? "" : "opacity-50"}>12%</Green>/
            <Green className={n === 3 ? "" : "opacity-50"}>18%</Green>/
            <Green className={n === 4 ? "" : "opacity-50"}>30%</Green>.
          </>
        );
      },
      isGranted: checkAscs[1],
      applyBuff: ({ totalAttr, charData, partyData, desc, tracker }) => {
        const visionCount = countVision(partyData, charData);
        const numOfElmts = Object.keys(visionCount).length;
        applyModifier(desc, totalAttr, "hp_", (numOfElmts === 4 ? 5 : numOfElmts) * 6, tracker);
      },
    },
  ],
  buffs: [
    {
      index: 1,
      src: EModSrc.A4,
      affect: EModAffect.ACTIVE_UNIT,
      desc: () => (
        <>
          During Depth-Clarion Dice [EB], your own active character gains <Green b>1%</Green> <Green>DMG Bonus</Green>{" "}
          which will increase by a further <Green b>3.5%</Green> every second. Maximum <Rose>50%</Rose>.
        </>
      ),
      isGranted: checkAscs[4],
      inputConfigs: [
        {
          label: "Stacks (max 14)",
          type: "text",
          max: 14,
        },
      ],
      applyBuff: ({ attPattBonus, inputs, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "all.pct_", 1 + 3.5 * (inputs[0] || 0), tracker);
      },
    },
    {
      index: 2,
      src: EModSrc.C4,
      affect: EModAffect.PARTY,
      desc: () => (
        <>
          Increases all party members' <Green>Max HP</Green> by <Green b>10%</Green> for 25s for every opponent marked
          by Lifeline [~ES] when the Lifeline explodes. Maximum <Rose>40%</Rose>.
        </>
      ),
      isGranted: checkCons[4],
      inputConfigs: [
        {
          type: "stacks",
          max: 4,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        applyModifier(desc, totalAttr, "hp_", 10 * (inputs[0] || 0), tracker);
      },
    },
  ],
};

export default Yelan;
