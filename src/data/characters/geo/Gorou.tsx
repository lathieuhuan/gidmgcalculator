import type { AttributeStat, CharData, DataCharacter, PartyData } from "@Src/types";
import { Geo, Green, Red } from "@Src/styled-components";
import { EModAffect } from "@Src/constants";
import { BOW_CAs, EModSrc, LIGHT_PAs, TALENT_LV_MULTIPLIERS } from "../constants";
import { finalTalentLv } from "@Src/utils";
import { applyModifier, makeModApplier, increaseAttackBonus } from "@Calculators/utils";
import { checkAscs, checkCons } from "../utils";

const getESBuffValue = (level: number) => Math.round(206 * TALENT_LV_MULTIPLIERS[2][level]);

const countGeo = (charData: CharData, partyData: PartyData) => {
  return partyData.reduce(
    (result, data) => (data.vision === "geo" ? result + 1 : result),
    charData.vision === "geo" ? 1 : 0
  );
};

const Gorou: DataCharacter = {
  code: 44,
  name: "Gorou",
  icon: "5/56/Character_Gorou_Thumb",
  sideIcon: "6/67/Character_Gorou_Side_Icon",
  rarity: 4,
  nation: "inazuma",
  vision: "geo",
  weapon: "bow",
  stats: [
    [802, 15, 54],
    [2061, 39, 140],
    [2661, 51, 180],
    [3985, 76, 270],
    [4411, 84, 299],
    [5074, 97, 344],
    [5642, 108, 382],
    [6305, 120, 427],
    [6731, 128, 456],
    [7393, 141, 501],
    [7818, 149, 530],
    [8481, 162, 575],
    [8907, 170, 603],
    [9570, 183, 648],
  ],
  bonusStat: { type: "geo", value: 6 },
  NAsConfig: {
    name: "Ripping Fang Fletching",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multBase: 37.75 },
        { name: "2-Hit", multBase: 37.15 },
        { name: "3-Hit", multBase: 49.45 },
        { name: "4-Hit", multBase: 59 },
      ],
    },
    CA: { stats: BOW_CAs },
    PA: { stats: LIGHT_PAs },
    ES: {
      name: "Inuzaka All-Round Defense",
      image: "e/e6/Talent_Inuzaka_All-Round_Defense",
      xtraLvAtCons: 3,
      stats: [
        { name: "Skill DMG", multBase: 107.2 },
        {
          name: "DEF Increase",
          notAttack: "other",
          multBase: 0,
          multType: 2,
          flat: { base: 206, type: 2 },
        },
      ],
      // getExtraStats: () => [
      //   { name: "Geo DMG Bonus", value: "10%" },
      //   { name: "Duration", value: "10s" },
      //   { name: "CD", value: "10s" },
      // ],
    },
    EB: {
      name: "Juuga: Forward Unto Victory",
      image: "f/f9/Talent_Juuga_Forward_Unto_Victory",
      xtraLvAtCons: 5,
      stats: [
        { name: "Skill DMG", baseStatType: "def", multBase: 98.22 },
        { name: "Crystal Collapse DMG", baseStatType: "def", multBase: 61.3 },
        {
          name: "Heal Amount (C4)",
          notAttack: "healing",
          isStatic: true,
          baseStatType: "def",
          multBase: 50,
        },
      ],
      // getExtraStats: () => [
      //   { name: "Duration", value: "9s" },
      //   { name: "CD", value: "20s" },
      // ],
      energyCost: 80,
    },
  },
  passiveTalents: [
    {
      name: "Heedless of the Wind and Weather",
      image: "8/89/Talent_Heedless_of_the_Wind_and_Weather",
    },
    { name: "A Favor Repaid", image: "6/61/Talent_A_Favor_Repaid" },
    { name: "Seeker of Shinies", image: "8/82/Talent_Seeker_of_Shinies" },
  ],
  constellation: [
    {
      name: "Rushing Hound: Swift as the Wind",
      image: "2/2e/Constellation_Rushing_Hound_Swift_as_the_Wind",
    },
    {
      name: "Sitting Hound: Steady as a Clock",
      image: "0/0c/Constellation_Sitting_Hound_Steady_as_a_Clock",
    },
    {
      name: "Mauling Hound: Fierce as Fire",
      image: "2/25/Constellation_Mauling_Hound_Fierce_as_Fire",
    },
    {
      name: "Lapping Hound: Warm as Water",
      image: "4/4d/Constellation_Lapping_Hound_Warm_as_Water",
    },
    {
      name: "Striking Hound: Thunderous Force",
      image: "4/47/Constellation_Striking_Hound_Thunderous_Force",
    },
    {
      name: "Valiant Hound: Mountainous Fealty",
      image: "9/9d/Constellation_Valiant_Hound_Mountainous_Fealty",
    },
  ],
  innateBuffs: [
    {
      src: EModSrc.A4,
      desc: () => (
        <>
          Gorou receives the following DMG Bonuses to his attacks based on his DEF:
          <br />• <Green>Inuzaka All-Round Defense</Green>: Skill DMG increased by{" "}
          <Green b>156%</Green> of <Green>DEF</Green>
          <br />• <Green>Juuga: Forward Unto Victory</Green>: Skill DMG and Crystal Collapse DMG
          increased by <Green b>15.6%</Green> of <Green>DEF</Green>
        </>
      ),
      isGranted: checkAscs[4],
      applyFinalBuff: ({ totalAttr, attPattBonus, desc, tracker }) => {
        const bnValues = [totalAttr.def * 1.56, totalAttr.def * 0.156];
        applyModifier(desc, attPattBonus, ["ES.flat", "EB.flat"], bnValues, tracker);
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.ES,
      desc: ({ toSelf, charData, inputs, partyData }) => {
        const numOfGeo = countGeo(charData, partyData);
        return (
          <>
            Provides up to 3 buffs to active characters within the skill's AoE based on the number
            of <Geo>Geo</Geo> characters in the party at the time of casting:
            <br />
            <span className={numOfGeo >= 1 ? "" : "opacity-50"}>
              • 1 Geo character: Adds "Standing Firm" - <Green>DEF Bonus</Green>
              {toSelf ? (
                "."
              ) : (
                <>
                  : <Red>{getESBuffValue(inputs?.[0] || 0)}.</Red>
                </>
              )}
            </span>
            <br />
            <span className={numOfGeo >= 2 ? "" : "opacity-50"}>
              • 2 Geo characters: Adds "Impregnable" - Increased resistance to interruption.
            </span>
            <br />
            <span className={numOfGeo >= 3 ? "" : "opacity-50"}>
              • 3 Geo character: Adds "Crunch" - <Green b>15%</Green> <Green>Geo DMG Bonus</Green>.
            </span>
          </>
        );
      },
      affect: EModAffect.ACTIVE_UNIT,
      inputConfigs: [
        {
          label: "Elemental Skill Level",
          type: "text",
          initialValue: 1,
          max: 13,
          for: "teammate",
        },
      ],
      applyBuff: (obj) => {
        const level = obj.toSelf
          ? finalTalentLv(obj.char, "ES", obj.partyData)
          : obj.inputs?.[0] || 1;
        const fields: AttributeStat[] = ["def"];
        const bonusValues = [getESBuffValue(level)];

        if (countGeo(obj.charData, obj.partyData) > 2) {
          fields.push("geo");
          bonusValues.push(15);
        }
        applyModifier(obj.desc, obj.totalAttr, fields, bonusValues, obj.tracker);
      },
    },
    {
      index: 1,
      src: EModSrc.A1,
      desc: () => (
        <>
          After using Juuga: Forward Unto Victory, all nearby party members' <Green>DEF</Green> is
          increased by <Green b>25%</Green> for 12s.
        </>
      ),
      isGranted: checkAscs[1],
      affect: EModAffect.PARTY,
      applyBuff: makeModApplier("totalAttr", "def_", 25),
    },
    {
      index: 3,
      src: EModSrc.C6,
      desc: ({ charData, partyData }) => {
        const n = countGeo(charData, partyData);
        return (
          <>
            For 12s after using Inuzaka All-Round Defense or Juuga: Forward Unto Victory, increases
            the <Green>CRIT DMG</Green> of all nearby party members' <Geo>Geo DMG</Geo> based on the
            buff level of the skill's field at the time of use:
            <br />
            <span className={n === 1 ? "" : "opacity-50"}>
              • "Standing Firm": <Green b>+10%</Green>
            </span>
            <br />
            <span className={n === 2 ? "" : "opacity-50"}>
              • "Impregnable": <Green b>+20%</Green>
            </span>
            <br />
            <span className={n >= 3 ? "" : "opacity-50"}>
              • "Crunch": <Green b>+40%</Green>
            </span>
          </>
        );
      },
      isGranted: checkCons[6],
      affect: EModAffect.PARTY,
      applyBuff: (obj) => {
        increaseAttackBonus({
          ...obj,
          element: "geo",
          type: "cDmg",
          value: [10, 20, 40, 40][countGeo(obj.charData, obj.partyData) - 1],
          mainCharVision: obj.charData.vision,
        });
      },
    },
  ],
};

export default Gorou;
