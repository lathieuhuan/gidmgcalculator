import type { CharInfo, DataCharacter, ModifierInput, PartyData } from "@Src/types";
import { Green, Rose } from "@Components/atoms";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { applyPercent, round } from "@Src/utils";
import { finalTalentLv, applyModifier, makeModApplier } from "@Src/utils/calculation";
import { checkAscs, checkCons } from "../utils";
import { NCPA_PERCENTS } from "@Data/constants";

const getEBDebuffValue = (
  fromSelf: boolean,
  char: CharInfo,
  inputs: ModifierInput[],
  partyData: PartyData
) => {
  const level = fromSelf
    ? finalTalentLv({ char, talents: Shenhe.activeTalents, talentType: "EB", partyData })
    : inputs[0] || 0;
  return level ? Math.min(5 + level, 15) : 0;
};

const Shenhe: DataCharacter = {
  code: 47,
  name: "Shenhe",
  icon: "5/58/Character_Shenhe_Thumb",
  sideIcon: "8/8d/Character_Shenhe_Side_Icon",
  rarity: 5,
  nation: "liyue",
  vision: "cryo",
  weaponType: "polearm",
  stats: [
    [1011, 24, 65],
    [2624, 61, 168],
    [3491, 82, 223],
    [5224, 122, 334],
    [5840, 137, 373],
    [6719, 157, 429],
    [7540, 176, 482],
    [8429, 197, 538],
    [9045, 211, 578],
    [9941, 232, 635],
    [10557, 247, 674],
    [11463, 268, 732],
    [12080, 282, 772],
    [12993, 304, 830],
  ],
  bonusStat: { type: "atk_", value: 7.2 },
  NAsConfig: {
    name: "Dawnstar Shooter",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: { root: 43.26 } },
        { name: "2-Hit", multFactors: { root: 40.25 } },
        { name: "3-Hit", multFactors: { root: 53.32 } },
        { name: "4-Hit (1/2)", multFactors: { root: 26.32 } },
        { name: "5-Hit", multFactors: { root: 65.62 } },
      ],
    },
    CA: { stats: [{ name: "Charged Attack", multFactors: { root: 110.67 } }] },
    PA: { stats: MEDIUM_PAs },
    ES: {
      name: "Spring Spirit Summoning",
      image: "6/6c/Talent_Spring_Spirit_Summoning",
      xtraLvAtCons: 3,
      stats: [
        { name: "Press Skill DMG", multFactors: { root: 139.2 } },
        { name: "Hold Skill DMG", multFactors: { root: 188.8 } },
        { name: "DMG Bonus", notAttack: "other", multFactors: { root: 45.66 } },
      ],
      // getExtraStats: () => [
      //   { name: "Press/Hold Duration", value: "10s/15s" },
      //   { name: "Press/Hold Trigger Quota", value: "5/7" },
      //   { name: "Press CD", value: "10s" },
      //   { name: "Hold CD", value: "15s" },
      // ],
    },
    EB: {
      name: "Divine Maiden's Deliverance",
      image: "d/d5/Talent_Divine_Maiden%27s_Deliverance",
      xtraLvAtCons: 5,
      stats: [
        { name: "Skill DMG", multFactors: { root: 100.8 } },
        { name: "DoT", multFactors: { root: 33.12 } },
      ],
      // getExtraStats: (lv) => [
      //   { name: "RES Decrease", value: Math.min(5 + lv, 15) + "%" },
      //   { name: "Duration", value: "12s" },
      //   { name: "CD", value: "20s" },
      // ],
      energyCost: 80,
    },
  },
  passiveTalents: [
    { name: "Deific Embrace", image: "2/29/Talent_Deific_Embrace" },
    { name: "Spirit Communion Seal", image: "5/5c/Talent_Spirit_Communion_Seal" },
    { name: "Precise Comings and Goings", image: "d/d0/Talent_Precise_Comings_and_Goings" },
  ],
  constellation: [
    { name: "Clarity of Heart", image: "1/13/Constellation_Clarity_of_Heart" },
    { name: "Centered Spirit", image: "9/90/Constellation_Centered_Spirit" },
    { name: "Seclusion", image: "d/d9/Constellation_Seclusion" },
    { name: "Insight", image: "4/46/Constellation_Insight" },
    { name: "Divine Attainment", image: "5/58/Constellation_Divine_Attainment" },
    { name: "Mystical Abandon", image: "0/0d/Constellation_Mystical_Abandon" },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.ES,
      desc: () => (
        <>
          When Normal, Charged and Plunging Attacks, Elemental Skills, and Elemental Bursts deal{" "}
          <Green>Cryo DMG</Green> the DMG dealt is increased based on Shenhe's{" "}
          <Green>current ATK</Green>.
        </>
      ),
      affect: EModAffect.PARTY,
      inputConfigs: [
        { label: "Current ATK", type: "text", max: 9999, for: "teammate" },
        { label: "Elemental Skill Level", type: "text", initialValue: 1, max: 13, for: "teammate" },
      ],
      applyFinalBuff: (obj) => {
        const { toSelf, inputs } = obj;
        const ATK = toSelf ? obj.totalAttr.atk : inputs[0] || 0;
        const level = toSelf
          ? finalTalentLv({ ...obj, talents: Shenhe.activeTalents, talentType: "ES" })
          : inputs[1] || 1;
        const mult = 45.66 * TALENT_LV_MULTIPLIERS[2][level];
        const xtraDesc = ` / Lv. ${level} / ${round(mult, 2)}% of ${ATK} ATK`;

        applyModifier(
          obj.desc + xtraDesc,
          obj.attElmtBonus,
          "cryo.flat",
          applyPercent(ATK, mult),
          obj.tracker
        );
      },
    },
    {
      index: 1,
      src: EModSrc.A1,
      desc: () => (
        <>
          An active character within Divine Maiden's Deliverance [EB] field gain{" "}
          <Green b>15%</Green> <Green>Cryo DMG Bonus</Green>.
        </>
      ),
      isGranted: checkAscs[1],
      affect: EModAffect.ACTIVE_UNIT,
      applyBuff: makeModApplier("totalAttr", "cryo", 15),
    },
    {
      index: 2,
      src: EModSrc.A4,
      desc: ({ inputs = [] }) => (
        <>
          After Shenhe uses Spring Spirit Summoning, she will grant all nearby party members the
          following effects:
          <br />
          <span className={inputs[0] ? "" : "opacity-50"}>
            • Press: <Green>Elemental Skill and Elemental Burst DMG</Green> increased by{" "}
            <Green b>15%</Green> for 10s.
          </span>
          <br />
          <span className={inputs[1] ? "" : "opacity-50"}>
            • Hold: <Green>Normal, Charged and Plunging Attack DMG</Green> increased by{" "}
            <Green b>15%</Green> for 15s.
          </span>
        </>
      ),
      isGranted: checkAscs[4],
      affect: EModAffect.PARTY,
      inputConfigs: [
        { label: "Press", type: "check", initialValue: 1 },
        { label: "Hold", type: "check", initialValue: 0 },
      ],
      applyBuff: ({ attPattBonus, inputs, desc, tracker }) => {
        if (inputs[0] === 1) {
          applyModifier(desc + " / Press", attPattBonus, ["ES.pct", "EB.pct"], 15, tracker);
        }
        if (inputs[1] === 1) {
          applyModifier(desc + " / Hold", attPattBonus, [...NCPA_PERCENTS], 15, tracker);
        }
      },
    },
    {
      index: 3,
      src: EModSrc.C2,
      desc: () => (
        <>
          Active characters within Divine Maiden's Deliverance's field deal <Green b>15%</Green>{" "}
          increased <Green>Cryo CRIT DMG</Green>.
        </>
      ),
      isGranted: checkCons[2],
      affect: EModAffect.ACTIVE_UNIT,
      applyBuff: makeModApplier("attElmtBonus", "cryo.cDmg", 15),
    },
    {
      index: 4,
      src: EModSrc.C4,
      desc: () => (
        <>
          Every time a character triggers Icy Quill's DMG Bonus, Shenhe will gain a Skyfrost Mantra
          stack for 60s. Each stack increases her next Spring Spirit Summoning{" "}
          <Green>[ES] DMG</Green> by <Green b>5%</Green>. Maximum <Rose>50 stacks</Rose>.
        </>
      ),
      isGranted: checkCons[4],
      affect: EModAffect.SELF,
      inputConfigs: [
        {
          label: "Stacks",
          type: "text",
          max: 50,
        },
      ],
      applyBuff: ({ attPattBonus, inputs, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "ES.pct", 5 * (inputs[0] || 0), tracker);
      },
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.EB,
      desc: ({ fromSelf, char, inputs, partyData }) => (
        <>
          The field decreases opponents' <Green>Cryo RES</Green> and <Green>Physical RES</Green> by{" "}
          <Green b>{getEBDebuffValue(fromSelf, char, inputs, partyData)}%</Green>.
        </>
      ),
      inputConfigs: [
        {
          label: "Elemental Burst Level",
          type: "text",
          initialValue: 1,
          max: 13,
          for: "teammate",
        },
      ],
      applyDebuff: ({ fromSelf, resistReduct, inputs, char, partyData, desc, tracker }) => {
        const pntValue = getEBDebuffValue(fromSelf, char, inputs, partyData);
        applyModifier(desc, resistReduct, ["phys", "cryo"], pntValue, tracker);
      },
    },
  ],
};

export default Shenhe;
