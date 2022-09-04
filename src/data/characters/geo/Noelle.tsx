import type { DataCharacter } from "@Src/types";
import { Geo, Green } from "@Src/styled-components";
import { EModAffect, NORMAL_ATTACKS } from "@Src/constants";
import { EModifierSrc, HEAVY_PAs, TALENT_LV_MULTIPLIERS } from "../constants";
import { applyPercent, finalTalentLv } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/calculators/utils";
import { charModCtrlIsActivated, checkCons, talentBuff } from "../utils";

const Noelle: DataCharacter = {
  code: 14,
  name: "Noelle",
  icon: "a/ab/Character_Noelle_Thumb",
  sideIcon: "5/5e/Character_Noelle_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "geo",
  weapon: "claymore",
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
        { name: "1-Hit", baseMult: 79.12 },
        { name: "2-Hit", baseMult: 73.36 },
        { name: "3-Hit", baseMult: 86.26 },
        { name: "4-Hit", baseMult: 113.43 },
      ],
    },
    CA: {
      stats: [
        { name: "Charged Attack Spinning", baseMult: 50.74 },
        { name: "Charged Attack Final", baseMult: 90.47 },
      ],
    },
    PA: { stats: HEAVY_PAs },
    ES: {
      name: "Breastplate",
      image: "5/5a/Talent_Breastplate",
      xtraLvAtCons: 3,
      stats: [
        { name: "Skill DMG", baseStatType: "def", baseMult: 120 },
        {
          name: "DMG Absorption",
          notAttack: "shield",
          baseStatType: "def",
          baseMult: 160,
          flat: { base: 770, type: 3 },
        },
        {
          name: "Healing",
          notAttack: "healing",
          baseStatType: "def",
          baseMult: 21.28,
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
        { name: "Burst DMG", baseMult: 67.2 },
        { name: "Skill DMG", baseMult: 92.8 },
        {
          name: "ATK Bonus",
          notAttack: "other",
          baseStatType: "def",
          baseMult: 40,
          multType: 2,
          getTalentBuff: ({ char, selfBuffCtrls }) => {
            const isActivated = charModCtrlIsActivated(Noelle.buffs!, char, selfBuffCtrls, 2);

            return talentBuff([isActivated, "mult", [false, 6], 50]);
          },
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
  buffs: [
    {
      index: 0,
      src: EModifierSrc.EB,
      desc: () => (
        <>
          • <Green>Converts</Green> attack DMG to <Geo>Geo DMG</Geo> that cannot be overridden by
          any other elemental infusion.
          <br />• Increased <Green>ATK</Green> that scales based on her <Green>DEF</Green>.
        </>
      ),
      affect: EModAffect.SELF,
      applyFinalBuff: ({ totalAttr, char, charBuffCtrls, partyData, desc, tracker }) => {
        const level = finalTalentLv(char, "EB", partyData);
        let mult = 40 * TALENT_LV_MULTIPLIERS[2][level];
        if (charModCtrlIsActivated(Noelle.buffs!, char, charBuffCtrls, 2)) {
          mult += 50;
        }
        applyModifier(desc, totalAttr, "atk", applyPercent(totalAttr.def, mult), tracker);
      },
      infuseConfig: {
        range: [...NORMAL_ATTACKS],
        overwritable: false,
      },
    },
    {
      index: 1,
      src: EModifierSrc.C2,
      desc: () => (
        <>
          Increases her <Green>Charged Attack DMG</Green> by <Green b>15%</Green>.
        </>
      ),
      isGranted: checkCons[2],
      affect: EModAffect.SELF,
      applyBuff: makeModApplier("attPattBonus", "CA.pct", 15),
    },
    {
      index: 2,
      src: EModifierSrc.C6,
      desc: () => (
        <>
          <Green>Sweeping Time</Green> increases Noelle's <Green>ATK</Green> by an additional{" "}
          <Green b>50%</Green> of her <Green>DEF</Green>.
        </>
      ),
      isGranted: checkCons[6],
      affect: EModAffect.SELF,
    },
  ],
};

export default Noelle;
