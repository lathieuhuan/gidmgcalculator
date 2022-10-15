import type { DataCharacter } from "@Src/types";
import { Green } from "@Src/styled-components";
import { EModAffect } from "@Src/constants";
import { BOW_CAs, EModSrc, LIGHT_PAs } from "../constants";
import { applyModifier, getInput } from "@Calculators/utils";
import { checkAscs, checkCons, countVisionTypes, talentBuff } from "../utils";

const Yelan: DataCharacter = {
  code: 51,
  name: "Yelan",
  icon: "a/a8/Character_Yelan_Thumb",
  sideIcon: "9/9c/Character_Yelan_Side_Icon",
  rarity: 5,
  nation: "liyue",
  vision: "hydro",
  weapon: "bow",
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
  bonusStat: { type: "cRate", value: 4.8 },
  NAsConfig: {
    name: "Stealthy Bowshot",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", baseMult: 40.68 },
        { name: "2-Hit", baseMult: 39.04 },
        { name: "3-Hit", baseMult: 51.6 },
        { name: "4-Hit (1/2)", baseMult: 32.51 },
      ],
    },
    CA: {
      stats: [
        ...BOW_CAs,
        {
          name: "Breakthrough Barb DMG",
          baseStatType: "hp",
          dmgTypes: ["CA", "hydro"],
          baseMult: 11.58,
          multType: 2,
        },
        {
          name: "Special Breakthrough Barb DMG (C6)",
          baseStatType: "hp",
          dmgTypes: ["CA", "hydro"],
          baseMult: 18.0648,
          multType: 2,
          conditional: true,
        },
      ],
    },
    PA: { stats: LIGHT_PAs },
    ES: {
      name: "Lingering Lifeline",
      image: "5/59/Talent_Lingering_Lifeline",
      xtraLvAtCons: 5,
      stats: [{ name: "Skill DMG", baseStatType: "hp", baseMult: 22.61 }],
      // getExtraStats: () => [
      //   { name: "Max Duration (Hold)", value: "3s" },
      //   { name: "CD", value: "10" },
      // ],
    },
    EB: {
      name: "Depth-Clarion Dice",
      image: "b/bd/Talent_Depth-Clarion_Dice",
      xtraLvAtCons: 3,
      stats: [
        {
          name: "Skill DMG",
          baseStatType: "hp",
          baseMult: 7.31,
        },
        {
          name: "Exquisite Throw DMG (1/3)",
          baseStatType: "hp",
          baseMult: 4.87,
        },
        {
          name: "Additional Water Arrow DMG (C2)",
          conditional: true,
          baseStatType: "hp",
          baseMult: 0,
          getTalentBuff: ({ char }) => talentBuff([checkCons[2](char), "mult", [false, 2], 14]),
        },
      ],
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
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      desc: ({ charData, partyData }) => {
        const n = countVisionTypes(charData, partyData);
        return (
          <>
            When the party has 1/2/3/4 Elemental Types, Yelan's <Green>Max HP</Green> is increased
            by <Green className={n === 1 ? "" : "opacity-50"}>6%</Green>/
            <Green className={n === 2 ? "" : "opacity-50"}>12%</Green>/
            <Green className={n === 3 ? "" : "opacity-50"}>18%</Green>/
            <Green className={n === 4 ? "" : "opacity-50"}>30%</Green>.
          </>
        );
      },
      isGranted: checkAscs[1],
      affect: EModAffect.SELF,
      applyBuff: ({ totalAttr, charData, partyData, desc, tracker }) => {
        const typeCount = countVisionTypes(charData, partyData);
        let buffValue = typeCount * 6;

        if (typeCount === 4) {
          buffValue += 6;
        }
        applyModifier(desc, totalAttr, "hp_", buffValue, tracker);
      },
    },
    {
      index: 1,
      src: EModSrc.A4,
      desc: () => (
        <>
          So long as an Exquisite Throw is in play, your own active character deals{" "}
          <Green b>1%</Green> <Green>more DMG</Green>. This increases by a further{" "}
          <Green b>3.5%</Green> <Green>DMG</Green> every second. The <Green>maximum</Green> increase
          to DMG dealt is <Green b>50%</Green>.
        </>
      ),
      isGranted: checkAscs[4],
      affect: EModAffect.ACTIVE_UNIT,
      inputConfig: {
        selfLabels: ["Stacks (max 14)"],
        labels: ["Stacks"],
        renderTypes: ["text"],
        initialValues: [0],
        maxValues: [14],
      },
      applyBuff: ({ attPattBonus, inputs, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "all.pct", 1 + 3.5 * getInput(inputs, 0, 0), tracker);
      },
    },
    {
      index: 2,
      src: EModSrc.C4,
      desc: () => (
        <>
          Increases all party members' <Green>Max HP</Green> by <Green b>10%</Green> for 25s for
          every opponent marked by Lifeline when the Lifeline explodes. A <Green>maximum</Green>{" "}
          increase of <Green b>40%</Green> <Green>Max HP</Green> can be attained in this manner.
        </>
      ),
      isGranted: checkCons[4],
      affect: EModAffect.PARTY,
      inputConfig: {
        selfLabels: ["Stacks"],
        labels: ["Stacks"],
        renderTypes: ["select"],
        initialValues: [1],
        maxValues: [4],
      },
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        applyModifier(desc, totalAttr, "hp_", 10 * getInput(inputs, 0, 0), tracker);
      },
    },
  ],
};

export default Yelan;
