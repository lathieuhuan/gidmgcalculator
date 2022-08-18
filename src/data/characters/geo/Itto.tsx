import type { AttributeStat, DataCharacter, GetTalentBuffFn } from "@Src/types";
import { Green } from "@Src/styled-components";
import { EModAffect, NORMAL_ATTACKS } from "@Src/constants";
import { EModifierSrc, HEAVIER_PAs, TALENT_LV_MULTIPLIERS } from "../constants";
import { applyPercent, finalTalentLv } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/calculators/utils";
import { charModCtrlIsActivated, checkAscs, checkCons, talentBuff } from "../utils";

const getA4TalentBuff: GetTalentBuffFn = ({ char, selfBuffCtrls, totalAttr }) =>
  talentBuff([
    charModCtrlIsActivated(Itto.buffs!, char, selfBuffCtrls, 1),
    "flat",
    [true, 4],
    applyPercent(totalAttr.def, 35),
  ]);

const Itto: DataCharacter = {
  code: 45,
  name: "Itto",
  GOOD: "AratakiItto",
  icon: "7/79/Character_Arataki_Itto_Thumb",
  sideIcon: "f/fe/Character_Arataki_Itto_Side_Icon",
  rarity: 5,
  nation: "inazuma",
  vision: "geo",
  weapon: "claymore",
  stats: [
    [1001, 18, 75],
    [2597, 46, 194],
    [3455, 61, 258],
    [5170, 91, 386],
    [5779, 102, 431],
    [6649, 117, 496],
    [7462, 132, 557],
    [8341, 147, 622],
    [8951, 158, 668],
    [9838, 174, 734],
    [10448, 185, 779],
    [11345, 200, 846],
    [11954, 211, 892],
    [12858, 227, 959],
  ],
  bonusStat: { type: "cRate", value: 4.8 },
  NAsConfig: {
    name: "Fight Club Legend",
    // getExtraStats: () => [
    //   { name: "Superlative Superstrength Duration", value: "60s" },
    //   { name: "Saichimonji Slash Stamina Cost", value: 20 },
    // ],
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", baseMult: 79.23 },
        { name: "2-Hit", baseMult: 76.37 },
        { name: "3-Hit", baseMult: 91.64 },
        { name: "4-Hit", baseMult: 117.22 },
      ],
    },
    CA: {
      stats: [
        {
          name: "Arataki Kesagiri Combo Slash DMG",
          baseMult: 91.16,
          getTalentBuff: getA4TalentBuff,
        },
        {
          name: "Arataki Kesagiri Final Slash DMG",
          baseMult: 190.92,
          getTalentBuff: getA4TalentBuff,
        },
        { name: "Saichimonji Slash DMG", baseMult: 90.47 },
      ],
    },
    PA: { stats: HEAVIER_PAs },
    ES: {
      name: "Masatsu Zetsugi: Akaushi Burst!",
      image: "5/51/Talent_Masatsu_Zetsugi_Akaushi_Burst%21",
      xtraLvAtCons: 3,
      stats: [{ name: "Skill DMG", baseMult: 307.2 }],
      // getExtraStats: () => [
      //   { name: "Inherited HP", value: "100%" },
      //   { name: "Duration", value: "6s" },
      //   { name: "CD", value: "10s" },
      // ],
    },
    EB: {
      name: "Royal Descent: Behold, Itto the Evil!",
      image: "5/50/Talent_Royal_Descent_Behold%2C_Itto_the_Evil%21",
      xtraLvAtCons: 5,
      stats: [{ name: "ATK Bonus", notAttack: "other", baseStatType: "def", baseMult: 57.6 }],
      // getExtraStats: () => [
      //   { name: "ATK SPD Bonus", value: "10%" },
      //   { name: "Duration", value: "11s" },
      //   { name: "CD", value: "18s" },
      // ],
      energyCost: 70,
    },
  },
  // actvTalents: [
  //   {
  //     desc: [
  //       {
  //         lines: [
  //           <>
  //             • <Green>Converts</Green> Itto's Normal, Charged, and Plunging Attacks to {geoDmg}.
  //             This cannot be overridden.
  //           </>,
  //           <>
  //             <br />• Increases Itto's <Green>Normal Attack SPD</Green>. Also increases his{" "}
  //             <Green>ATK</Green> based on his <Green>DEF</Green>.
  //           </>,
  //         ],
  //       },
  //     ],
  //   },
  // ],
  passiveTalents: [
    { name: "Arataki Ichiban", image: "a/a5/Talent_Arataki_Ichiban" },
    { name: "Bloodline of the Crimson Oni", image: "d/db/Talent_Bloodline_of_the_Crimson_Oni" },
    { name: "Woodchuck Chucked", image: "4/47/Talent_Woodchuck_Chucked" },
  ],
  constellation: [
    { name: "Stay a While and Listen Up", image: "6/64/Constellation_Stay_a_While_and_Listen_Up" },
    {
      name: "Gather 'Round, It's a Brawl!",
      image: "0/09/Constellation_Gather_%27Round%2C_It%27s_a_Brawl%21",
    },
    {
      name: "Horns Lowered, Coming Through",
      image: "a/a5/Constellation_Horns_Lowered%2C_Coming_Through",
    },
    { name: "Jailhouse Bread and Butter", image: "d/d4/Constellation_Jailhouse_Bread_and_Butter" },
    {
      name: "10 Years of Hanamizaka Fame",
      image: "f/f3/Constellation_10_Years_of_Hanamizaka_Fame",
    },
    { name: "Arataki Itto, Present!", image: "8/89/Constellation_Arataki_Itto%2C_Present%21" },
  ],
  buffs: [
    {
      index: 0,
      src: EModifierSrc.EB,
      desc: () => (
        <>
          When Arataki Itto uses consecutive Arataki Kesagiri, he obtains the following effects:
          <br />• Each slash increases the <Green>ATK SPD</Green> of the next slash by{" "}
        </>
      ),
      affect: EModAffect.SELF,
      applyFinalBuff: ({ totalAttr, char, partyData, desc, tracker }) => {
        const level = finalTalentLv(char, "EB", partyData);
        const fields: AttributeStat[] = ["atk", "naAtkSpd"];
        const buffValue = applyPercent(totalAttr.def, 57.6 * TALENT_LV_MULTIPLIERS[2][level]);
        applyModifier(desc, totalAttr, fields, [buffValue, 10], tracker);
      },
      infuseConfig: {
        range: [...NORMAL_ATTACKS],
        overwritable: false,
      },
    },
    {
      index: 1,
      src: EModifierSrc.A4,
      desc: () => (
        <>
          <Green>Arataki Kesagiri DMG</Green> is increased by <Green b>35%</Green> of Itto's{" "}
          <Green>DEF</Green>.
        </>
      ),
      isGranted: checkAscs[4],
      affect: EModAffect.SELF,
    },
    {
      index: 2,
      src: EModifierSrc.C4,
      desc: () => (
        <>
          When the Raging Oni King state caused by Royal Descent: Behold, Itto the Evil ends, all
          nearby party members gain <Green b>20%</Green> <Green>DEF</Green> and <Green b>20%</Green>{" "}
          <Green>ATK</Green> for 10s.
        </>
      ),
      isGranted: checkCons[4],
      affect: EModAffect.PARTY,
      applyBuff: makeModApplier("totalAttr", ["def_", "atk_"], 20),
    },
    {
      index: 3,
      src: EModifierSrc.C6,
      desc: () => (
        <>
          Itto's <Green>Charged Attacks</Green> deal <Green b>+70%</Green> <Green>CRIT DMG</Green>.
        </>
      ),
      isGranted: checkCons[6],
      affect: EModAffect.SELF,
      applyBuff: makeModApplier("attPattBonus", "CA.cDmg", 70),
    },
  ],
};

export default Itto;
