import type { CharInfo, DataCharacter, ModifierInput, PartyData } from "@Src/types";
import { Anemo, Green, Lightgold } from "@Components/atoms";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { BOW_CAs, EModSrc, LIGHT_PAs } from "../constants";
import { applyPercent, round } from "@Src/utils";
import { finalTalentLv, applyModifier, makeModApplier } from "@Src/utils/calculation";
import { checkAscs, checkCons } from "../utils";

interface GetWindGiftBuffValueArgs {
  toSelf: boolean;
  inputs: ModifierInput[];
  char: CharInfo;
  partyData: PartyData;
}
const getWindGiftBuffValue = ({ toSelf, inputs, char, partyData }: GetWindGiftBuffValueArgs) => {
  const level = toSelf
    ? finalTalentLv({ char, dataChar: Faruzan, talentType: "EB", partyData })
    : inputs[0] || 0;
  return level ? round(18 * TALENT_LV_MULTIPLIERS[2][level], 1) : 0;
};

const Faruzan: DataCharacter = {
  code: 64,
  name: "Faruzan",
  // icon: "a/a1/Character_Faruzan_Thumb",
  icon: "b/b2/Faruzan_Icon",
  sideIcon: "0/00/Character_Faruzan_Side_Icon",
  rarity: 4,
  nation: "sumeru",
  vision: "anemo",
  weaponType: "bow",
  stats: [
    [802, 16, 53],
    [2061, 42, 135],
    [2661, 55, 175],
    [3985, 82, 262],
    [4411, 91, 289],
    [5074, 104, 333],
    [5642, 116, 370],
    [6305, 129, 414],
    [6731, 138, 442],
    [7393, 152, 485],
    [7819, 161, 513],
    [8481, 174, 556],
    [8907, 183, 584],
    [9570, 196, 628],
  ],
  bonusStat: { type: "atk_", value: 6 },
  NAsConfig: {
    name: "Parthian Shot",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: 44.73 },
        { name: "2-Hit", multFactors: 42.19 },
        { name: "3-Hit", multFactors: 53.16 },
        { name: "4-Hit", multFactors: 70.62 },
      ],
    },
    CA: { stats: BOW_CAs },
    PA: { stats: LIGHT_PAs },
    ES: {
      name: "Wind Realm of Nasamjnin",
      image: "4/46/Talent_Wind_Realm_of_Nasamjnin",
      stats: [
        { name: "Skill DMG", multFactors: 148.8 },
        { name: "Pressurized Collapse Vortex DMG", multFactors: 108 },
      ],
    },
    EB: {
      name: "The Wind's Secret Ways",
      image: "f/fc/Talent_The_Wind%27s_Secret_Ways",
      stats: [{ name: "Skill DMG", multFactors: 377.6 }],
      energyCost: 80,
    },
  },
  passiveTalents: [
    {
      name: "Impetuous Flow",
      image: "7/7f/Talent_Impetuous_Flow",
      desc: (
        <>
          When Faruzan is in the Manifest Gale state [~ES], the amount of time taken to charge a
          shot is decreased by 60%, and she can apply Perfidious Wind's Bale [debuff] to opponents
          who are hit by the vortex created by Pressurized Collapse [~ES].
        </>
      ),
    },
    {
      name: "Lost Wisdom of the Seven Caverns",
      image: "3/35/Talent_Lost_Wisdom_of_the_Seven_Caverns",
      get desc() {
        return (
          <>
            {this.xtraDesc?.[0]} This DMG Bonus will be cleared 0.1s after dealing Anemo DMG to
            opponents, and can be triggered once every 0.8s.
          </>
        );
      },
      xtraDesc: [
        <>
          When characters affected by Prayerful Wind's Gift [~EB] deal <Anemo>Anemo DMG</Anemo> to
          opponents, this DMG will be increased based on <Green b>32%</Green> of Faruzan's own{" "}
          <Green>ATK</Green>.
        </>,
      ],
    },
    {
      name: "Tomes Light the Path",
      image: "2/23/Talent_Tomes_Light_the_Path",
      desc: <></>,
    },
  ],
  constellation: [
    {
      name: "Truth by Any Means",
      image: "f/f2/Constellation_Truth_by_Any_Means",
      desc: (
        <>
          Faruzan can fire off a maximum of 2 Hurricane Arrows using fully charged Aimed Shots while
          under a single Wind Realm of Nasamjnin [ES] effect.
        </>
      ),
    },
    {
      name: "Overzealous Intellect",
      image: "5/5b/Constellation_Overzealous_Intellect",
      desc: (
        <>
          The duration of the Dazzling Polyhedron created by The Wind's Secret Ways [EB] increased
          by 6s.
        </>
      ),
    },
    { name: "Spirit-Orchard Stroll", image: "b/b5/Constellation_Spirit-Orchard_Stroll" },
    {
      name: "Divine Comprehension",
      image: "8/82/Constellation_Divine_Comprehension",
      desc: (
        <>
          The vortex created by Wind Realm of Nasamjnin [ES] will restore Energy to Faruzan based on
          the number of opponents hit: If it hits 1 opponent, it will restore 2 Energy for Faruzan.
          Each additional opponent hit will restore 0.5 more Energy for Faruzan.
          <br />A maximum of 4 Energy can be restored to her per vortex.
        </>
      ),
    },
    { name: "Wonderland of Rumination", image: "f/f7/Constellation_Wonderland_of_Rumination" },
    {
      name: "The Wondrous Path of Truth",
      image: "9/9a/Constellation_The_Wondrous_Path_of_Truth",
      get desc() {
        return (
          <>
            {this.xtraDesc?.[0]} When the active character deals DMG under this affect, they will
            apply Pressurized Collapse [~ES] to the opponent damaged. This effect can be triggered
            once every 3s. This CD is shared between all party members.
          </>
        );
      },
      xtraDesc: [
        <>
          Characters affected by Prayerful Wind's Benefit [EB buff] have their{" "}
          <Green>Anemo CRIT DMG</Green> increased by <Green>40%</Green>.
        </>,
      ],
    },
  ],
  buffs: [
    {
      index: 0,
      src: "Prayerful Wind's Benefit",
      affect: EModAffect.PARTY,
      desc: (args) => {
        return (
          <>
            Increases <Green>Anemo DMG Bonus</Green> to all nearby characters by{" "}
            <Green b>{getWindGiftBuffValue(args)}%</Green>.
            <br />• At <Lightgold>A4</Lightgold>, increases <Anemo>Anemo DMG</Anemo> based on{" "}
            <Green b>32%</Green> of Faruzan's <Green>Base ATK</Green>.
            <br />• At <Lightgold>C6</Lightgold>, increases <Anemo>Anemo</Anemo>{" "}
            <Green>CRIT DMG</Green> by <Green b>40%</Green>.
          </>
        );
      },
      inputConfigs: [
        { label: "Elemental Burst Level", type: "text", initialValue: 1, max: 13, for: "teammate" },
        { label: "Ascension 4", type: "check", for: "teammate" },
        { label: "Base ATK (A4)", type: "text", max: 9999, for: "teammate" },
        { label: "Constellation 6", type: "check", for: "teammate" },
      ],
      applyBuff: ({ totalAttr, desc, tracker, ...rest }) => {
        applyModifier(desc, totalAttr, "anemo", getWindGiftBuffValue(rest), tracker);
      },
      applyFinalBuff: ({
        toSelf,
        char,
        totalAttr,
        inputs,
        attElmtBonus,
        partyData,
        desc,
        tracker,
      }) => {
        if (toSelf ? checkAscs[4](char) : inputs[1]) {
          const ATK = toSelf ? totalAttr.base_atk : inputs[2] || 0;
          const level = toSelf
            ? finalTalentLv({ char, dataChar: Faruzan, talentType: "EB", partyData })
            : inputs[0] || 1;
          const mult = 32;
          const finalDesc = desc + ` / Lv. ${level} / ${round(mult, 2)}% of ${ATK} Base ATK`;

          applyModifier(finalDesc, attElmtBonus, "anemo.flat", applyPercent(ATK, mult), tracker);
        }
        if (toSelf ? checkCons[6](char) : inputs[3]) {
          const descC6 = `${toSelf ? "Self" : "Faruzan"} / ${EModSrc.C6}`;
          applyModifier(descC6, attElmtBonus, "anemo.cDmg_", 40, tracker);
        }
      },
    },
  ],
  debuffs: [
    {
      index: 0,
      src: "Perfidious Wind's Bale",
      desc: () => (
        <>
          Decreases opponents' <Green>Anemo RES</Green> by <Green b>30%</Green>.
        </>
      ),
      applyDebuff: makeModApplier("resistReduct", "anemo", 30),
    },
  ],
};

export default Faruzan;
