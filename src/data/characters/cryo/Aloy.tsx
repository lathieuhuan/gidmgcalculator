import type { CharInfo, DataCharacter, ModifierInput, PartyData } from "@Src/types";
import { Cryo, Green, Lightgold, Red, Rose } from "@Src/styled-components";
import { EModAffect } from "@Src/constants";
import { BOW_CAs, EModSrc, LIGHT_PAs, TALENT_LV_MULTIPLIERS } from "../constants";
import { finalTalentLv, round2 } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Calculators/utils";
import { checkAscs } from "../utils";

const getNApctBonus = (args: { char: CharInfo; partyData: PartyData; inputs: ModifierInput[] }) => {
  const level = finalTalentLv(args.char, "ES", args.partyData);
  let stacks = args.inputs[0] || 0;
  stacks = stacks === 4 ? 5 : stacks;
  return round2(5.846 * TALENT_LV_MULTIPLIERS[5][level] * stacks);
};

const Aloy: DataCharacter = {
  code: 39,
  name: "Aloy",
  icon: "6/6a/Character_Aloy_Thumb",
  sideIcon: "0/0c/Character_Aloy_Side_Icon",
  rarity: 5,
  nation: "outland",
  vision: "cryo",
  weaponType: "bow",
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
        { name: "1-Hit", multBase: [21.12, 23.76] },
        { name: "2-Hit", multBase: 43.12 },
        { name: "3-Hit", multBase: 52.8 },
        { name: "4-Hit", multBase: 65.65 },
      ],
    },
    CA: { stats: BOW_CAs },
    PA: { stats: LIGHT_PAs },
    ES: {
      name: "Frozen Wilds",
      image: "9/9a/Talent_Frozen_Wilds",
      stats: [
        { name: "Freeze Bomb", multBase: 177.6 },
        { name: "Chillwater Bomblets", multBase: 40 },
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
      stats: [{ name: "Skill DMG", multBase: 359.2 }],
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
      desc: (args) => (
        <>
          Increases Aloy's <Green>Normal Attack DMG</Green>. When she has 4 Coil stacks, all stacks
          are cleared. Aloy then enters the Rushing Ice state, which further increases her{" "}
          <Green>Normal Attack DMG</Green> and converts it to <Cryo>Cryo DMG</Cryo>.{" "}
          <Red>Total DMG Bonus: {getNApctBonus(args)}%.</Red>
          <br />• At <Lightgold>A1</Lightgold> when Aloy receives Coil effect, her{" "}
          <Green>ATK</Green> is increased by <Green b>16%</Green> for 10s.
          <br />• At <Lightgold>A4</Lightgold> when Aloy is in Rushing Ice state, her{" "}
          <Green>Cryo DMG Bonus</Green> increases by <Green b>3.5%</Green> every 1s, up to{" "}
          <Rose>35%</Rose>.
        </>
      ),
      affect: EModAffect.SELF,
      inputConfigs: [
        {
          type: "stacks",
          max: 4,
        },
        {
          label: "Time passed (A4)",
          type: "stacks",
          max: 10,
        },
      ],
      applyBuff: (obj) => {
        const { char, desc, tracker } = obj;
        applyModifier(desc, obj.attPattBonus, "NA.pct", getNApctBonus(obj), tracker);

        if (checkAscs[1](char)) {
          applyModifier(desc, obj.totalAttr, "atk_", 16, tracker);
        }
        if (checkAscs[4](char)) {
          applyModifier(desc, obj.totalAttr, "cryo", 3.5 * (obj.inputs[1] || 0), tracker);
        }
      },
    },
    {
      index: 2,
      src: EModSrc.A1,
      desc: () => (
        <>
          when Aloy receives the Coil effect, nearby party members' <Green>ATK</Green> is increased
          by <Green b>8%</Green> for 10s.
        </>
      ),
      isGranted: checkAscs[1],
      affect: EModAffect.TEAMMATE,
      applyBuff: makeModApplier("totalAttr", "atk_", 8),
    },
  ],
};

export default Aloy;
