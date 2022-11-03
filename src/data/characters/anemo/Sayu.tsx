import type { DataCharacter, GetTalentBuffFn } from "@Src/types";
import { Green, Red } from "@Src/styled-components";
import { EModAffect } from "@Src/constants";
import { EModSrc, HEAVY_PAs } from "../constants";
import { charModIsInUse, checkAscs, checkCons, findInput, talentBuff } from "../utils";

const getC2TalentBuff: GetTalentBuffFn = ({ char, selfBuffCtrls }) => {
  const isActivated = charModIsInUse(Sayu.buffs!, char, selfBuffCtrls, 1);
  const buffValue = 3.3 * Math.floor(+findInput(selfBuffCtrls, 1, 0) / 0.5);

  return talentBuff([isActivated, "pct", [false, 2], buffValue]);
};

const getC6TalentBuff = (index: number): GetTalentBuffFn => {
  return ({ char, totalAttr }) => {
    const buffValue = Math.min(totalAttr.em, 2000) * (index ? 3 : 0.2);

    return talentBuff([checkCons[6](char), index ? "flat" : "mult", [false, 6], buffValue]);
  };
};

const Sayu: DataCharacter = {
  code: 36,
  name: "Sayu",
  icon: "e/ec/Character_Sayu_Thumb",
  sideIcon: "4/4a/Character_Sayu_Side_Icon",
  rarity: 4,
  nation: "inazuma",
  vision: "anemo",
  weapon: "claymore",
  stats: [
    [994, 20, 62],
    [2553, 53, 160],
    [3296, 68, 207],
    [4937, 102, 310],
    [5464, 113, 343],
    [6285, 130, 395],
    [6988, 144, 439],
    [7809, 161, 491],
    [8337, 172, 524],
    [9157, 189, 575],
    [9684, 200, 608],
    [10505, 216, 660],
    [11033, 227, 693],
    [11854, 244, 745],
  ],
  bonusStat: { type: "em", value: 24 },
  NAsConfig: {
    name: "Shuumatsuban Ninja Blade",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", baseMult: 72.24 },
        { name: "2-Hit", baseMult: 71.38 },
        { name: "3-Hit (1/2)", baseMult: 43.43 },
        { name: "4-Hit", baseMult: 98.13 },
      ],
    },
    CA: {
      stats: [
        { name: "Charged Attack Spinning", baseMult: 62.55 },
        { name: "Charged Attack Final", baseMult: 113.09 },
      ],
    },
    PA: { stats: HEAVY_PAs },
    ES: {
      name: "Yoohoo Art: Fuuin Dash",
      image: "4/4b/Talent_Yoohoo_Art_Fuuin_Dash",
      xtraLvAtCons: 5,
      stats: [
        { name: "Fuufuu Windwheel DMG", baseMult: 36 },
        { name: "Fuufuu Windwheel Elemental DMG", dmgTypes: ["ES", "various"], baseMult: 16.8 },
        {
          name: "Press Kick",
          baseMult: 158.4,
          getTalentBuff: ({ char, selfBuffCtrls }) => {
            const isActivated = charModIsInUse(Sayu.buffs!, char, selfBuffCtrls, 1);

            return talentBuff([isActivated, "pct", [false, 2], 3.3]);
          },
        },
        { name: "Hold Kick", baseMult: 217.6, getTalentBuff: getC2TalentBuff },
        {
          name: "Kick's Elemental DMG",
          dmgTypes: ["ES", "various"],
          baseMult: 76.16,
          getTalentBuff: getC2TalentBuff,
        },
        {
          name: "Heal Amount (A1)",
          notAttack: "healing",
          isStatic: true,
          baseStatType: "em",
          baseMult: 1.2,
          flat: { base: 300, type: 0 },
        },
      ],
      // getExtraStats: () => [
      //   { name: "Max Duration (Hold)", value: "10s" },
      //   { name: "CD", value: "6s to 11s" },
      // ],
    },
    EB: {
      name: "Yoohoo Art: Mujina Flurry",
      image: "b/be/Talent_Yoohoo_Art_Mujina_Flurry",
      xtraLvAtCons: 3,
      stats: [
        { name: "Burst DMG", baseMult: 116.8 },
        {
          name: "Activation Healing",
          notAttack: "healing",
          baseStatType: "atk",
          baseMult: 92.16,
          multType: 2,
          flat: { base: 577, type: 3 },
        },
        {
          name: "Daruma DMG",
          baseMult: 52,
          getTalentBuff: getC6TalentBuff(0),
        },
        {
          name: "Daruma Healing",
          notAttack: "healing",
          baseStatType: "atk",
          baseMult: 79.87,
          multType: 2,
          flat: { base: 500, type: 3 },
          getTalentBuff: getC6TalentBuff(1),
        },
      ],
      // getExtraStats: () => [
      //   { name: "Duration", value: "12s" },
      //   { name: "CD", value: "20s" },
      // ],
      energyCost: 80,
    },
  },
  passiveTalents: [
    { name: "Someone More Capable", image: "0/07/Talent_Someone_More_Capable" },
    { name: "No Work Today!", image: "8/85/Talent_No_Work_Today%21" },
    { name: "Yoohoo Art: Silencer's Secret", image: "b/bc/Talent_Yoohoo_Art_Silencer%27s_Secret" },
  ],
  constellation: [
    { name: "Multi-Task no Jutsu", image: "2/22/Constellation_Multi-Task_no_Jutsu" },
    { name: "Egress Prep", image: "3/31/Constellation_Egress_Prep" },
    {
      name: "Eh, the Bunshin Can Handle It",
      image: "8/8c/Constellation_Eh%2C_the_Bunshin_Can_Handle_It",
    },
    { name: "Skiving: New and Improved", image: "9/9e/Constellation_Skiving_New_and_Improved" },
    { name: "Speed Comes First", image: "a/aa/Constellation_Speed_Comes_First" },
    { name: "Sleep O'Clock", image: "2/22/Constellation_Sleep_O%27Clock" },
  ],
  innateBuffs: [
    {
      src: EModSrc.C6,
      desc: () => (
        <>
          Each point of Sayu's <Green>Elemental Mastery</Green> will:
          <br />• Increases <Green>DMG</Green> dealt by the Daruma's attacks by{" "}
          <Green b>0.2%</Green> <Green>ATK</Green>, up to <Green b>400%</Green> ATK.
          <br />• Increases <Green>HP restored</Green> by Daruma by <Green b>3</Green>, up to{" "}
          <Green b>6,000</Green> additional HP.
        </>
      ),
      isGranted: checkCons[6],
    },
  ],
  buffs: [
    {
      index: 1,
      src: EModSrc.C2,
      desc: () => (
        <>
          Yoohoo Art: Fuuin Dash gains the following effects:
          <br />• <Green>Press Kick DMG</Green> increased by <Green b>3.3%</Green>.
          <br />• <Green>Hold Kick DMG</Green> increased by <Green b>3.3%</Green> for every 0.5s
          Sayu in Fuufuu Windwheel state, up to <Green b>66%</Green>.
        </>
      ),
      isGranted: checkCons[2],
      affect: EModAffect.SELF,
      inputConfig: {
        selfLabels: ["Time (max. 10 sec)"],
        renderTypes: ["text"],
        initialValues: [0],
        maxValues: [10],
      },
    },
  ],
};

export default Sayu;
