import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { Green, Rose } from "@Src/pure-components";
import { applyPercent } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc, HEAVY_PAs } from "../constants";
import { checkCons, exclBuff } from "../utils";

const Dehya: DefaultAppCharacter = {
  code: 68,
  name: "Dehya",
  icon: "3/3f/Dehya_Icon",
  sideIcon: "a/af/Dehya_Side_Icon",
  rarity: 5,
  nation: "sumeru",
  vision: "pyro",
  weaponType: "claymore",
  EBcost: 70,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  stats: [
    [1220, 21, 49],
    [3165, 54, 127],
    [4212, 71, 169],
    [6302, 107, 252],
    [7045, 119, 282],
    [8106, 137, 324],
    [9097, 154, 364],
    [10168, 172, 407],
    [10912, 185, 437],
    [11993, 203, 480],
    [12736, 216, 510],
    [13829, 234, 554],
    [14573, 247, 584],
    [15675, 265, 628],
  ],
  bonusStat: {
    type: "hp_",
    value: 7.2,
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 62.12 },
      { name: "2-Hit", multFactors: 61.71 },
      { name: "3-Hit", multFactors: 76.63 },
      { name: "4-Hit", multFactors: 95.29 },
    ],
    CA: [
      { name: "Charged Attack Spinning", multFactors: 56.33 },
      { name: "Charged Attack Final", multFactors: 101.82 },
    ],
    PA: HEAVY_PAs,
    ES: [
      { name: "Indomitable Flame", multFactors: 112.88 },
      { name: "Ranging Flame", multFactors: 132.8 },
      {
        id: "ES.0",
        name: "Field DMG",
        multFactors: [
          {
            root: 60.2,
          },
          {
            root: 1.03,
            attributeType: "hp",
          },
        ],
        multFactorsAreOne: true,
      },
    ],
    EB: [
      {
        name: "Flame-Mane's Fist",
        multFactors: [{ root: 98.7 }, { root: 1.69, attributeType: "hp" }],
        multFactorsAreOne: true,
      },
      {
        name: "Incineration Drive",
        multFactors: [{ root: 139.3 }, { root: 2.39, attributeType: "hp" }],
        multFactorsAreOne: true,
      },
    ],
  },
  activeTalents: {
    NAs: {
      name: "Sandstorm Assault",
    },
    ES: {
      name: "Molten Inferno",
      image: "6/6b/Talent_Molten_Inferno",
    },
    EB: {
      name: "The Lioness's Bite",
      image: "1/12/Talent_Leonine_Bite",
    },
  },
  passiveTalents: [
    { name: "Unstinting Succor", image: "4/47/Talent_Unstinting_Succor" },
    { name: "Stalwart and True", image: "1/12/Talent_Stalwart_and_True" },
    { name: "The Sunlit Way", image: "e/ee/Talent_The_Sunlit_Way" },
  ],
  constellation: [
    { name: "The Flame Incandescent", image: "5/50/Constellation_The_Flame_Incandescent" },
    { name: "The Sand-Blades Glittering", image: "0/08/Constellation_The_Sand-Blades_Glittering" },
    { name: "A Rage Swift as Fire", image: "e/ee/Constellation_A_Rage_Swift_as_Fire" },
    { name: "An Oath Abiding", image: "3/31/Constellation_An_Oath_Abiding" },
    { name: "The Alpha Unleashed", image: "3/38/Constellation_The_Alpha_Unleashed" },
    { name: "The Burning Claws Cleaving", image: "2/26/Constellation_The_Burning_Claws_Cleaving" },
  ],
  innateBuffs: [
    {
      src: EModSrc.C1,
      isGranted: checkCons[1],
      desc: () => (
        <>
          Dehya's {Max HP}#[gr] is increased by <Green>20%</Green>, and:
          <br />• Molten Inferno's {[ES] DMG}#[gr] will be increased by <Green b>3.6%</Green> of her{" "}
          {Max HP}#[gr].
          <br />• The Lioness's Bite's {[EB] DMG}#[gr] will be increased by {6%}#[b,gr] of her{" "}
          {Max HP}#[gr].
        </>
      ),
      applyBuff: makeModApplier("totalAttr", "hp_", 20),
      applyFinalBuff: ({ totalAttr, attPattBonus, tracker, desc }) => {
        const buffs = [3.6, 6].map((mult) => ({
          value: applyPercent(totalAttr.hp, mult),
          desc: desc + ` / ${mult}% of ${Math.round(totalAttr.hp)} HP`,
        }));

        applyModifier(buffs[0].desc, attPattBonus, "ES.flat", buffs[0].value, tracker);
        applyModifier(buffs[1].desc, attPattBonus, "EB.flat", buffs[1].value, tracker);
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      isGranted: checkCons[2],
      desc: () => (
        <>
          When a <Green>Fiery Sanctum</Green> exists on the field, {DMG}#[gr] dealt by its next coordinated
          attack will be increased by {50%}#[b,gr] when active character(s) within the Fiery Sanctum field are
          attacked.
        </>
      ),
      applyBuff: ({ calcItemBuffs }) => {
        calcItemBuffs.push(exclBuff(EModSrc.C2, "ES.0", "pct_", 50));
      },
    },
    {
      index: 1,
      src: EModSrc.C6,
      affect: EModAffect.SELF,
      isGranted: checkCons[6],
      desc: () => (
        <>
          The {CRIT Rate}#[gr] of The Lioness's Bite [EB] is increased by {10%}#[b,gr]. After a
          Flame-Mane's Fist attack hits an opponent and deals CRIT hits, it will cause the {CRIT DMG}#[gr] of
          The Lioness's Bite to increase by {15%}#[b,gr] for the rest of Blazing Lioness's duration. Max{" "}
          <Rose>60%</Rose>.
        </>
      ),
      inputConfigs: [
        {
          type: "stacks",
          initialValue: 0,
          max: 4,
        },
      ],
      applyBuff: ({ attPattBonus, inputs, desc, tracker }) => {
        const buffValue = (inputs[0] || 0) * 15;
        applyModifier(desc, attPattBonus, ["EB.cRate_", "EB.cDmg_"], [10, buffValue], tracker);
      },
    },
  ],
};

export default Dehya as AppCharacter;
