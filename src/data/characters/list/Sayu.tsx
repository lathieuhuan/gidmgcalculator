import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { Green, Rose } from "@Src/pure-components";
import { EModSrc, HEAVY_PAs } from "../constants";
import { checkCons, exclBuff } from "../utils";

const Sayu: DefaultAppCharacter = {
  code: 36,
  name: "Sayu",
  icon: "2/22/Sayu_Icon",
  sideIcon: "7/7d/Sayu_Side_Icon",
  rarity: 4,
  nation: "inazuma",
  vision: "anemo",
  weaponType: "claymore",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
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
  bonusStat: {
    type: "em",
    value: 24,
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 72.24 },
      { name: "2-Hit", multFactors: 71.38 },
      { name: "3-Hit (1/2)", multFactors: 43.43 },
      { name: "4-Hit", multFactors: 98.13 },
    ],
    CA: [
      { name: "Charged Attack Spinning", multFactors: 62.55 },
      { name: "Charged Attack Final", multFactors: 113.09 },
    ],
    PA: HEAVY_PAs,
    ES: [
      { name: "Fuufuu Windwheel DMG", multFactors: 36 },
      {
        name: "Fuufuu Windwheel Elemental DMG",
        attElmt: "various",
        multFactors: 16.8,
      },
      { id: "ES.0", name: "Press Kick", multFactors: 158.4 },
      { id: "ES.1", name: "Hold Kick", multFactors: 217.6 },
      {
        id: "ES.2",
        name: "Kick's Elemental DMG",
        attElmt: "various",
        multFactors: 76.16,
      },
      {
        name: "Heal Amount (A1)",
        type: "healing",
        multFactors: { root: 120, scale: 0, attributeType: "em" },
        flatFactor: { root: 300, scale: 0 },
      },
    ],
    EB: [
      { name: "Burst DMG", multFactors: 116.8 },
      {
        name: "Activation Healing",
        type: "healing",
        multFactors: { root: 92.16, attributeType: "atk" },
        flatFactor: 577,
      },
      {
        id: "EB.0",
        name: "Daruma DMG",
        multFactors: 52,
      },
      {
        id: "EB.1",
        name: "Daruma Healing",
        type: "healing",
        multFactors: { root: 79.87, attributeType: "atk" },
        flatFactor: 500,
      },
    ],
  },
  activeTalents: {
    NAs: {
      name: "Shuumatsuban Ninja Blade",
    },
    ES: {
      name: "Yoohoo Art: Fuuin Dash",
      image: "4/4b/Talent_Yoohoo_Art_Fuuin_Dash",
    },
    EB: {
      name: "Yoohoo Art: Mujina Flurry",
      image: "b/be/Talent_Yoohoo_Art_Mujina_Flurry",
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
    { name: "Eh, the Bunshin Can Handle It", image: "8/8c/Constellation_Eh%2C_the_Bunshin_Can_Handle_It" },
    { name: "Skiving: New and Improved", image: "9/9e/Constellation_Skiving_New_and_Improved" },
    { name: "Speed Comes First", image: "a/aa/Constellation_Speed_Comes_First" },
    { name: "Sleep O'Clock", image: "2/22/Constellation_Sleep_O%27Clock" },
  ],
  innateBuffs: [
    {
      src: EModSrc.C6,
      description: `Each point of Sayu's {Elemental Mastery}#[gr] will:
      <br />• Increases {Daruma DMG}#[gr] by {0.2%}#[b,gr] {ATK}#[gr], up to {400%}#[r].
      <br />• Increases {HP restored}#[gr] by Daruma by {3}#[b,gr], up to {6,000}#[r] additional HP.`,
      isGranted: checkCons[6],
      applyFinalBuff: ({ totalAttr, calcItemBuffs }) => {
        const buffValue = Math.min(totalAttr.em, 2000);
        calcItemBuffs.push(
          exclBuff(EModSrc.C6, "EB.0", "mult_", buffValue * 0.2),
          exclBuff(EModSrc.C6, "EB.1", "flat", buffValue * 3)
        );
      },
    },
  ],
  buffs: [
    {
      index: 1,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      description: `Yoohoo Art: Fuuin Dash [ES] gains the following effects:
      <br />• {Press Kick DMG}#[gr] increased by {3.3%}#[b,gr].
      <br />• {Hold Kick DMG}#[gr] increased by {3.3%}#[b,gr] for every 0.5s Sayu in Fuufuu Windwheel state, up to
      {66%}#[r].`,
      isGranted: checkCons[2],
      inputConfigs: [
        {
          label: "Seconds (max. 10)",
          type: "text",
          max: 10,
        },
      ],
      applyBuff: ({ inputs, calcItemBuffs }) => {
        calcItemBuffs.push(
          exclBuff(EModSrc.C2, "ES.0", "pct_", 3.3),
          exclBuff(EModSrc.C2, ["ES.1", "ES.2"], "pct_", 3.3 * Math.floor((inputs[0] || 0) / 0.5))
        );
      },
    },
  ],
};

export default Sayu as AppCharacter;
