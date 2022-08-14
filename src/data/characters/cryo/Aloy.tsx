import type { CharInfo, DataCharacter, ModifierCtrl, PartyData } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { Cryo, Green, Red } from "@Src/styled-components";
import { BOW_CAs, EModifierSrc, LIGHT_PAs, TALENT_LV_MULTIPLIERS } from "../constants";
import { round2, totalXtraTalentLv } from "@Src/utils";
import { checkAscs, findInput, modIsActivated } from "../utils";
import { applyModifier } from "@Src/calculators/utils";

const getCoilStacksBuff = (char: CharInfo, partyData: PartyData, charBuffCtrls: ModifierCtrl[]) => {
  const level = totalXtraTalentLv(char, "ES", partyData);
  const stacks = modIsActivated(charBuffCtrls, 1) ? 5 : findInput(charBuffCtrls, 0, 0);
  return round2(5.846 * TALENT_LV_MULTIPLIERS[5][level] * +stacks);
};

const Aloy: DataCharacter = {
  code: 39,
  name: "Aloy",
  icon: "6/6a/Character_Aloy_Thumb",
  sideIcon: "0/0c/Character_Aloy_Side_Icon",
  rarity: 5,
  nation: "outland",
  vision: "cryo",
  weapon: "bow",
  stats: [
    [848, 18, 53],
    [2201, 47, 137],
    [2928, 63, 182],
    [4382, 94, 272],
    [4899, 105, 304],
    [5636, 121, 350],
    [6325, 136, 393],
    [7070, 152, 439],
    [7587, 163, 471],
    [8339, 179, 517],
    [8856, 190, 550],
    [9616, 206, 597],
    [10133, 217, 629],
    [10899, 234, 676],
  ],
  bonusStat: { type: "cryo", value: 7.2 },
  NAsConfig: {
    name: "Rapid Fire",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", baseMult: [21.12, 23.76] },
        { name: "2-Hit", baseMult: 43.12 },
        { name: "3-Hit", baseMult: 52.8 },
        { name: "4-Hit", baseMult: 65.65 },
      ],
    },
    CA: { stats: BOW_CAs },
    PA: { stats: LIGHT_PAs },
    ES: {
      name: "Frozen Wilds",
      image: "9/9a/Talent_Frozen_Wilds",
      stats: [
        { name: "Freeze Bomb", baseMult: 177.6 },
        { name: "Chillwater Bomblets", baseMult: 40 },
      ],
      // getExtraStats: (lv) => [
      //   {
      //     name: "ATK Decrease",
      //     value: Math.min(11 + Math.ceil(lv / 3), 15) + "%",
      //   },
      //   { name: "ATK Decrease Duration", value: "6s" },
      //   {
      //     name: "Coil Normal Attack DMG Bonus",
      //     value: [1, 2, 3]
      //       .map((stack) => round2(5.846 * TALENT_LV_MULTIPLIERS[5][lv] * stack) + "%")
      //       .join(" / "),
      //   },
      //   {
      //     name: "Rushing Ice Normal Attack DMG Bonus",
      //     value: round2(29.23 * TALENT_LV_MULTIPLIERS[5][lv]) + "%",
      //   },
      //   { name: "Rushing Ice Duration", value: "10s" },
      //   { name: "CD", value: "20s" },
      // ],
    },
    EB: {
      name: "Prophecies of Dawn",
      image: "b/b4/Talent_Prophecies_of_Dawn",
      stats: [{ name: "Skill DMG", baseMult: 359.2 }],
      // getExtraStats: () => [{ name: "CD", value: "12s" }],
      energyCost: 40,
    },
  },
  passiveTalents: [
    { name: "Combat Override", image: "0/01/Talent_Combat_Override" },
    { name: "Strong Strike", image: "b/ba/Talent_Strong_Strike" },
    { name: "Easy Does It", image: "0/0f/Talent_Easy_Does_It" },
  ],
  constellation: [],
  buffs: [
    {
      index: 0,
      src: "Coil stacks",
      desc: ({ char, partyData, charBuffCtrls }) => (
        <>
          Each stack increases Aloy's <Green>Normal Attack DMG</Green>{" "}
          <Red>Total DMG Bonus: {getCoilStacksBuff(char, partyData, charBuffCtrls)}%.</Red>
        </>
      ),
      isGranted: () => true,
      affect: EModAffect.SELF,
      inputConfig: {
        selfLabels: ["Stacks"],
        renderTypes: ["select"],
        initialValues: [1],
        maxValues: [3],
      },
      applyBuff: ({ attPattBonus, char, charBuffCtrls, partyData, desc, tracker }) => {
        const bnValue = getCoilStacksBuff(char, partyData, charBuffCtrls);
        applyModifier(desc, attPattBonus, "NA.pct", bnValue, tracker);
      },
    },
    {
      index: 1,
      src: "Max Coil stacks",
      desc: () => (
        <>
          When Aloy has 4 Coil stacks, all stacks of Coil are cleared. She then enters the Rushing
          Ice state, which further increases the <Green>DMG</Green> dealt by her{" "}
          <Green>Normal Attacks</Green> and converts her <Green>Normal Attack DMG</Green> to{" "}
          <Cryo>Cryo DMG</Cryo>.
        </>
      ),
      isGranted: () => true,
      affect: EModAffect.SELF,
      infuseConfig: {
        range: ["NA"],
        overwritable: false,
      },
    },
    {
      index: 2,
      src: EModifierSrc.A1,
      desc: () => (
        <>
          When Aloy receives the Coil effect from Frozen Wilds, her <Green>ATK</Green> is increased
          by <Green b>16%</Green>, while nearby party members' <Green>ATK</Green> is increased by{" "}
          <Green b>8%</Green>. This effect lasts 10s.
        </>
      ),
      isGranted: checkAscs[1],
      affect: EModAffect.PARTY,
      applyBuff: ({ totalAttr, toSelf, desc, tracker }) => {
        applyModifier(desc, totalAttr, "atk_", toSelf ? 16 : 8, tracker);
      },
    },
    {
      index: 3,
      src: EModifierSrc.A4,
      desc: () => (
        <>
          When Aloy is in the Rushing Ice state conferred by Frozen Wilds, her{" "}
          <Green>Cryo DMG Bonus</Green> increases by <Green b>3.5%</Green> every 1s, up to{" "}
          <Green b>35%</Green>.
        </>
      ),
      isGranted: checkAscs[4],
      affect: EModAffect.SELF,
      inputConfig: {
        selfLabels: ["Stacks"],
        renderTypes: ["select"],
        initialValues: [1],
        maxValues: [10],
      },
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        applyModifier(desc, totalAttr, "cryo", 3.5 * +inputs![0], tracker);
      },
    },
  ],
};

export default Aloy;
