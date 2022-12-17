import type { DataCharacter } from "@Src/types";
import { Geo, Green } from "@Components/atoms";
import { EModAffect } from "@Src/constants";
import { EModSrc, HEAVY_PAs, TALENT_LV_MULTIPLIERS } from "../constants";
import { applyPercent, finalTalentLv } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Calculators/utils";
import { checkCons, talentBuff } from "../utils";

const Noelle: DataCharacter = {
  code: 14,
  name: "Noelle",
  icon: "a/ab/Character_Noelle_Thumb",
  sideIcon: "5/5e/Character_Noelle_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "geo",
  weaponType: "claymore",
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
  bonusStat: { type: "def_", value: 7.5 },
  NAsConfig: {
    name: "Favonius Bladework - Maid",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multBase: 79.12 },
        { name: "2-Hit", multBase: 73.36 },
        { name: "3-Hit", multBase: 86.26 },
        { name: "4-Hit", multBase: 113.43 },
      ],
    },
    CA: {
      stats: [
        { name: "Charged Attack Spinning", multBase: 50.74 },
        { name: "Charged Attack Final", multBase: 90.47 },
      ],
    },
    PA: { stats: HEAVY_PAs },
    ES: {
      name: "Breastplate",
      image: "5/5a/Talent_Breastplate",
      xtraLvAtCons: 3,
      stats: [
        { name: "Skill DMG", baseStatType: "def", multBase: 120 },
        {
          name: "DMG Absorption",
          notAttack: "shield",
          baseStatType: "def",
          multBase: 160,
          flat: { base: 770, type: 3 },
        },
        {
          name: "Healing",
          notAttack: "healing",
          baseStatType: "def",
          multBase: 21.28,
          flat: { base: 103, type: 3 },
        },
      ],
      // getExtraStats: (lv) => [
      //   { name: "Healing Trigger Chance", value: (lv < 11 ? 49 + lv : lv === 11 ? 59 : 60) + "%" },
      //   { name: "Duration", value: "12s" },
      //   { name: "CD", value: "24s" },
      // ],
    },
    EB: {
      name: "Sweeping Time",
      image: "7/7c/Talent_Sweeping_Time",
      xtraLvAtCons: 5,
      stats: [
        { name: "Burst DMG", multBase: 67.2 },
        { name: "Skill DMG", multBase: 92.8 },
        {
          name: "ATK Bonus",
          notAttack: "other",
          baseStatType: "def",
          multBase: 40,
          multType: 2,
          getTalentBuff: ({ char }) => talentBuff([checkCons[6](char), "mult", [false, 6], 50]),
        },
      ],
      // getExtraStats: () => [
      //   { name: "Duration", value: "15s" },
      //   { name: "CD", value: "15s" },
      // ],
      energyCost: 60,
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
      applyBuff: makeModApplier("attPattBonus", "CA.pct", 15),
    },
    {
      src: EModSrc.C6,
      desc: () => (
        <>
          Sweeping Time [EB] increases Noelle's <Green>ATK</Green> by an additional{" "}
          <Green b>50%</Green> of her <Green>DEF</Green>.
        </>
      ),
      isGranted: checkCons[6],
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      desc: () => (
        <>
          • Converts <Green>attack DMG</Green> to <Geo>Geo DMG</Geo> that cannot be overridden by
          any other elemental infusion.
          <br />• Increased <Green>ATK</Green> that scales based on her <Green>DEF</Green>.
        </>
      ),
      affect: EModAffect.SELF,
      applyFinalBuff: ({ totalAttr, char, partyData, desc, tracker }) => {
        const level = finalTalentLv(char, "EB", partyData);
        const mult = 40 * TALENT_LV_MULTIPLIERS[2][level] + (checkCons[6](char) ? 50 : 0);
        applyModifier(desc, totalAttr, "atk", applyPercent(totalAttr.def, mult), tracker);
      },
      infuseConfig: {
        overwritable: false,
      },
    },
  ],
};

export default Noelle;
