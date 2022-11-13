import type { DataCharacter, CharInfo, PartyData } from "@Src/types";
import { Green, Lightgold, Pyro, Rose } from "@Src/styled-components";
import { EModAffect } from "@Src/constants";
import { BOW_CAs, EModSrc, LIGHT_PAs, TALENT_LV_MULTIPLIERS } from "../constants";
import { finalTalentLv, round2 } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Calculators/utils";
import { checkAscs, checkCons } from "../utils";

const getESBuffValue = (char: CharInfo, partyData: PartyData) => {
  const level = finalTalentLv(char, "ES", partyData);
  return round2(37.91 * TALENT_LV_MULTIPLIERS[5][level]);
};

const Yoimiya: DataCharacter = {
  code: 38,
  name: "Yoimiya",
  icon: "0/05/Character_Yoimiya_Thumb",
  sideIcon: "5/5f/Character_Yoimiya_Side_Icon",
  rarity: 5,
  nation: "inazuma",
  vision: "pyro",
  weapon: "bow",
  stats: [
    [791, 25, 48],
    [2053, 65, 124],
    [2731, 87, 165],
    [4086, 130, 247],
    [4568, 145, 276],
    [5256, 167, 318],
    [5899, 187, 357],
    [6593, 209, 399],
    [7075, 225, 428],
    [7777, 247, 470],
    [8259, 262, 500],
    [8968, 285, 542],
    [9450, 300, 572],
    [10164, 323, 615],
  ],
  bonusStat: { type: "cRate", value: 4.8 },
  NAsConfig: {
    name: "Firework Flare-Up",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit (1/2)", multBase: 35.64, multType: 4 },
        { name: "2-Hit", multBase: 68.38, multType: 4 },
        { name: "3-Hit", multBase: 88.89, multType: 4 },
        { name: "4-Hit (1/2)", multBase: 46.42, multType: 4 },
        { name: "5-Hit", multBase: 105.86, multType: 4 },
      ],
    },
    CA: { stats: [...BOW_CAs, { name: "Kindling Arrow", multBase: 16.4 }] },
    PA: { stats: LIGHT_PAs },
    ES: {
      name: "Niwabi Fire-Dance",
      image: "0/03/Talent_Niwabi_Fire-Dance",
      xtraLvAtCons: 3,
      stats: [],
      // getExtraStats: (lv) => [
      //   {
      //     name: "Blazing Arrow DMG",
      //     value: round2(100 + 37.91 * TALENT_LV_MULTIPLIERS[5][lv]) + "% Normal Attack DMG",
      //   },
      //   { name: "Duration", value: "10s" },
      //   { name: "CD", value: "18s" },
      // ],
    },
    EB: {
      name: "Ryuukin Saxifrage",
      image: "a/a7/Talent_Ryuukin_Saxifrage",
      xtraLvAtCons: 5,
      stats: [
        { name: "Skill DMG", multBase: 127.2 },
        { name: "Aurous Blaze Explosion", multBase: 122 },
      ],
      // getExtraStats: () => [
      //   { name: "Duration", value: "10s" },
      //   { name: "CD", value: "15s" },
      // ],
      energyCost: 60,
    },
  },
  passiveTalents: [
    { name: "Tricks of the Trouble-Maker", image: "a/a2/Talent_Tricks_of_the_Trouble-Maker" },
    { name: "Summer Night's Dawn", image: "9/9b/Talent_Summer_Night%27s_Dawn" },
    { name: "Blazing Match", image: "6/6e/Talent_Blazing_Match" },
  ],
  constellation: [
    { name: "Agate Ryuukin", image: "8/8c/Constellation_Agate_Ryuukin" },
    { name: "A Procession of Bonfires", image: "7/77/Constellation_A_Procession_of_Bonfires" },
    { name: "Trickster's Flare", image: "7/7e/Constellation_Trickster%27s_Flare" },
    { name: "Pyrotechnic Professional", image: "e/e2/Constellation_Pyrotechnic_Professional" },
    { name: "A Summer Festival's Eve", image: "b/bc/Constellation_A_Summer_Festival%27s_Eve" },
    { name: "Naganohara Meteor Swarm", image: "c/cc/Constellation_Naganohara_Meteor_Swarm" },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.ES,
      desc: ({ char, partyData }) => (
        <>
          During Niwabi Fire-Dance [ES], Yoimiya's <Green>Normal Attack DMG</Green> will be
          increased by <Green b>{getESBuffValue(char, partyData)}%</Green> and converted to{" "}
          <Pyro>Pyro DMG</Pyro>.
          <br />• At <Lightgold>A1</Lightgold>, Normal Attacks on hit will increase Yoimiya's{" "}
          <Green>Pyro DMG Bonus</Green> by <Green b>2%</Green> for 3s. Maximum{" "}
          <Rose>10 stacks</Rose>.
        </>
      ),
      affect: EModAffect.SELF,
      inputConfigs: [
        {
          label: "Stacks (A4)",
          type: "stacks",
          initialValue: 0,
          max: 10,
        },
      ],
      applyBuff: ({ totalAttr, attPattBonus, char, partyData, inputs = [], desc, tracker }) => {
        const buffValue = getESBuffValue(char, partyData);
        applyModifier(desc, attPattBonus, "NA.specialMult", buffValue, tracker);

        if (checkAscs[1](char)) {
          applyModifier(desc, totalAttr, "pyro", 2 * (inputs[0] || 0), tracker);
        }
      },
      infuseConfig: {
        overwritable: false,
      },
    },
    {
      index: 2,
      src: EModSrc.A4,
      desc: () => (
        <>
          Using Ryuukin Saxifrage causes nearby party members (excluding Yoimiya) to gain a{" "}
          <Green b>10%</Green> <Green>ATK Bonus</Green> for 15s. Additionally, a further ATK Bonus
          will be added on based on the number of "Tricks of the Trouble-Maker" (A1) stacks Yoimiya
          possesses when using Ryuukin Saxifrage. Each stack increases this <Green>ATK Bonus</Green>{" "}
          by <Green b>1%</Green>.
        </>
      ),
      isGranted: checkAscs[4],
      affect: EModAffect.TEAMMATE,
      inputConfigs: [
        {
          type: "stacks",
          initialValue: 0,
          max: 10,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        applyModifier(desc, totalAttr, "atk_", 10 + (inputs?.[0] || 0), tracker);
      },
    },
    {
      index: 3,
      src: EModSrc.C1,
      desc: () => (
        <>
          When an opponent affected by Aurous Blaze is defeated within its duration, Yoimiya's{" "}
          <Green>ATK</Green> is increased by <Green b>20%</Green> for 20s.
        </>
      ),
      isGranted: checkCons[1],
      affect: EModAffect.SELF,
      applyBuff: makeModApplier("totalAttr", "atk_", 20),
    },
    {
      index: 4,
      src: EModSrc.C2,
      desc: () => (
        <>
          When Yoimiya's <Pyro>Pyro DMG</Pyro> scores a CRIT Hit, she will gain a{" "}
          <Green b>25%</Green> <Green>Pyro DMG Bonus</Green> for 6s. Can work off-field.
        </>
      ),
      isGranted: checkCons[2],
      affect: EModAffect.SELF,
      applyBuff: makeModApplier("totalAttr", "pyro", 25),
    },
  ],
};

export default Yoimiya;
