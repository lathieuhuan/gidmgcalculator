import type { DataCharacter } from "@Src/types";
import { Electro, Green } from "@Src/styled-components";
import { EModAffect } from "@Src/constants";
import { EModSrc, HEAVY_PAs } from "../constants";
import { makeModApplier } from "@Calculators/utils";
import { checkCons } from "../utils";

const Dori: DataCharacter = {
  code: 56,
  name: "Dori",
  icon: "9/90/Character_Dori_Thumb",
  sideIcon: "0/0f/Character_Dori_Side_Icon",
  rarity: 4,
  nation: "sumeru",
  vision: "electro",
  weaponType: "claymore",
  stats: [
    [1039, 19, 61],
    [2670, 48, 156],
    [3447, 62, 201],
    [5163, 93, 301],
    [5715, 103, 333],
    [6573, 118, 384],
    [7309, 131, 427],
    [8168, 147, 477],
    [8719, 157, 509],
    [9577, 172, 559],
    [10129, 182, 591],
    [10987, 198, 641],
    [11539, 208, 673],
    [12397, 223, 723],
  ],
  bonusStat: { type: "hp_", value: 6 },
  NAsConfig: {
    name: "Marvelous Sword-Dance (Modified)",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multBase: 90.21 },
        { name: "2-Hit", multBase: [41.07, 43.12] },
        { name: "3-Hit", multBase: 128.4 },
        {
          name: "Heal on Normal Attacks hit (C6)",
          notAttack: "healing",
          baseStatType: "hp",
          multBase: 4,
          multType: 0,
        },
      ],
    },
    CA: {
      stats: [
        { name: "Charged Attack Spinning", multBase: 62.55 },
        { name: "Charged Attack Final", multBase: 113.09 },
      ],
    },
    PA: { stats: HEAVY_PAs },
    ES: {
      name: "Spirit-Warding Lamp: Troubleshooter Cannon",
      image: "c/c8/Talent_Spirit-Warding_Lamp_Troubleshooter_Cannon",
      xtraLvAtCons: 5,
      stats: [
        { name: "Troubleshooter Shot DMG", multBase: 147.28 },
        { name: "After-Sales Service Round DMG", multBase: 31.56 },
      ],
      // getExtraStats: () => [{ name: "CD", value: "9s" }],
    },
    EB: {
      name: "Alcazarzaray's Exactitude",
      image: "7/77/Talent_Alcazarzaray%27s_Exactitude",
      xtraLvAtCons: 3,
      stats: [
        { name: "Connector DMG", multBase: 15.88 },
        {
          name: "Continuous Healing",
          notAttack: "healing",
          baseStatType: "hp",
          multBase: 6.67,
          multType: 2,
          flat: { base: 642, type: 3 },
        },
      ],
      // getExtraStats: (lv) => [
      //   { name: "Energy Regeneration", value: Math.min(1.5 + Math.floor(lv / 2) * 0.1, 2) },
      //   { name: "Duration", value: "12s" },
      //   { name: "CD", value: "20s" },
      // ],
      energyCost: 80,
    },
  },
  passiveTalents: [
    {
      name: "An Eye for Gold",
      image: "a/ae/Talent_An_Eye_for_Gold",
      desc: (
        <>
          After a character connected to the Jinni triggers an Electro-Charged, Superconduct,
          Overloaded, Quicken, Aggravate, Hyperbloom, or an Electro Swirl or Crystallize reaction,
          the <Green>CD</Green> of Spirit-Warding Lamp: Troubleshooter Cannon is decreased by{" "}
          <Green b>1s</Green>. <br />
          This effect can be triggered once every 3s.
        </>
      ),
    },
    {
      name: "Compound Interest",
      image: "6/6e/Talent_Compound_Interest",
      desc: (
        <>
          When the Troubleshooter Shots or After-Sales Service Rounds from Spirit-Warding Lamp:
          Troubleshooter Cannon hit opponents, Dori will restore 5 Elemental Energy for every 100%
          Energy Recharge possessed. <br />
          Per Spirit-Warding Lamp: Troubleshooter Cannon, only one instance of Energy restoration
          can be triggered and a maximum of 15 Energy can be restored this way.
        </>
      ),
    },
    {
      name: "Unexpected Order",
      image: "d/dc/Talent_Unexpected_Order",
    },
  ],
  constellation: [
    {
      name: "Additional Investment",
      image: "e/e1/Constellation_Additional_Investment",
      desc: (
        <>
          The number of After-Sales Service Rounds created by Troubleshooter Shots is increased by
          1.
        </>
      ),
    },
    {
      name: "Special Franchise",
      image: "9/92/Constellation_Special_Franchise",
      desc: (
        <>
          When you are in combat and the Jinni heals the character it is connected to, it will fire
          a Jinni Toop from that character's position that deals 50% of Dori's ATK DMG.
        </>
      ),
    },
    { name: "Wonders Never Cease", image: "6/6f/Constellation_Wonders_Never_Cease" },
    {
      name: "Discretionary Supplement",
      image: "d/d7/Constellation_Discretionary_Supplement",
      get desc() {
        return (
          <>
            The character connected to the Lamp Spirit will obtain the following buffs based on
            their current HP and Energy:
            <br />• When their HP is lower than 50%, they gain 50% Incoming Healing Bonus.
            <br />• When their Energy {this.xtraDesc?.[0]}.
          </>
        );
      },
      xtraDesc: [
        <>
          is less than 50%, they gain <Green b>30%</Green> <Green>Energy Recharge</Green>.
        </>,
      ],
    },
    { name: "Value for Mora", image: "a/ab/Constellation_Value_for_Mora" },
    {
      name: "Sprinkling Weight",
      image: "a/ab/Constellation_Sprinkling_Weight",
      desc: (
        <>
          Dori gains the following effects for 3s after using Spirit-Warding Lamp: Troubleshooter
          Cannon:
          <br />• <Electro>Electro Infusion</Electro>.
          <br />• When Normal Attacks hit opponents, all party members will heal HP equivalent to{" "}
          <Green b>4%</Green> of Dori's <Green>Max HP</Green>. This type of healing can occur once
          every 0.1s.
        </>
      ),
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.C4,
      desc: () => (
        <>
          When Energy of the character connected to the Lamp Spirit{" "}
          {Dori.constellation[3].xtraDesc?.[0]}
        </>
      ),
      isGranted: checkCons[4],
      affect: EModAffect.ACTIVE_UNIT,
      applyBuff: makeModApplier("totalAttr", "er", 30),
    },
  ],
};

export default Dori;
