import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { Geo, Green, Lightgold } from "@Src/pure-components";
import { applyPercent } from "@Src/utils";
import { applyModifier, finalTalentLv, makeModApplier } from "@Src/utils/calculation";
import { EModSrc, HEAVY_PAs } from "../constants";
import { checkCons } from "../utils";

const Noelle: DefaultAppCharacter = {
  code: 14,
  name: "Noelle",
  icon: "8/8e/Noelle_Icon",
  sideIcon: "1/15/Noelle_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "geo",
  weaponType: "claymore",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  stats: [
    [1012, 16, 67],
    [2600, 41, 172],
    [3356, 53, 222],
    [5027, 80, 333],
    [5564, 88, 368],
    [6400, 101, 423],
    [7117, 113, 471],
    [7953, 126, 526],
    [8490, 134, 562],
    [9325, 148, 617],
    [9862, 156, 652],
    [10698, 169, 708],
    [11235, 178, 743],
    [12071, 191, 799],
  ],
  bonusStat: {
    type: "def_",
    value: 7.5,
  },
  calcListConfig: {
    ES: { multAttributeType: "def" },
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 79.12 },
      { name: "2-Hit", multFactors: 73.36 },
      { name: "3-Hit", multFactors: 86.26 },
      { name: "4-Hit", multFactors: 113.43 },
    ],
    CA: [
      { name: "Charged Attack Spinning", multFactors: 50.74 },
      { name: "Charged Attack Final", multFactors: 90.47 },
    ],
    PA: HEAVY_PAs,
    ES: [
      { name: "Skill DMG", multFactors: 120 },
      {
        name: "DMG Absorption",
        type: "shield",
        multFactors: 160,
        flatFactor: 770,
      },
      {
        name: "Healing",
        type: "healing",
        multFactors: 21.28,
        flatFactor: 103,
      },
      {
        name: "Emergent Shield (A1)",
        type: "shield",
        multFactors: { root: 400, scale: 0 },
      },
      {
        name: "Shield break DMG (C4)",
        multFactors: { root: 400, attributeType: "atk", scale: 0 },
        attPatt: "none",
      },
    ],
    EB: [
      { name: "Burst DMG", multFactors: 67.2 },
      { name: "Skill DMG", multFactors: 92.8 },
    ],
  },
  activeTalents: {
    NAs: {
      name: "Favonius Bladework - Maid",
    },
    ES: {
      name: "Breastplate",
      image: "5/5a/Talent_Breastplate",
    },
    EB: {
      name: "Sweeping Time",
      image: "7/7c/Talent_Sweeping_Time",
    },
  },
  passiveTalents: [
    { name: "Devotion", image: "b/b2/Talent_Devotion" },
    { name: "Nice and Clean", image: "9/9a/Talent_Nice_and_Clean" },
    { name: "Maid's Knighthood", image: "d/dd/Talent_Maid%27s_Knighthood" },
  ],
  constellation: [
    { name: "I Got Your Back", image: "7/73/Constellation_I_Got_Your_Back" },
    { name: "Combat Maid", image: "7/73/Constellation_Combat_Maid" },
    { name: "Invulnerable Maid", image: "3/36/Constellation_Invulnerable_Maid" },
    { name: "To Be Cleaned", image: "8/81/Constellation_To_Be_Cleaned" },
    { name: "Favonius Sweeper Master", image: "3/3f/Constellation_Favonius_Sweeper_Master" },
    { name: "Must Be Spotless", image: "1/14/Constellation_Must_Be_Spotless" },
  ],
  innateBuffs: [
    {
      src: EModSrc.C2,
      desc: () => (
        <>
          Increases her <Green>Charged Attack DMG</Green> by <Green b>15%</Green>.
        </>
      ),
      isGranted: checkCons[2],
      applyBuff: makeModApplier("attPattBonus", "CA.pct_", 15),
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          • Grants Noelle a <Geo>Geo Infusion</Geo> that cannot be overridden.
          <br />• Increases Noelle's <Green>ATK</Green> based on her <Green>DEF</Green>. At <Lightgold>C6</Lightgold>,
          the multipler bonus is increased by <Green b>50%</Green>.
        </>
      ),
      applyFinalBuff: ({ totalAttr, char, partyData, desc, tracker }) => {
        const level = finalTalentLv({
          char,
          charData: Noelle as AppCharacter,
          talentType: "EB",
          partyData,
        });
        const mult = 40 * TALENT_LV_MULTIPLIERS[2][level] + (checkCons[6](char) ? 50 : 0);
        applyModifier(desc, totalAttr, "atk", applyPercent(totalAttr.def, mult), tracker);
      },
      infuseConfig: {
        overwritable: false,
      },
    },
  ],
};

export default Noelle as AppCharacter;
