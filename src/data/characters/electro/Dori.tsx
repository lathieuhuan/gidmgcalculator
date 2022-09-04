import type { DataCharacter } from "@Src/types";
import { Electro, Green } from "@Src/styled-components";
import { EModAffect, NORMAL_ATTACKS } from "@Src/constants";
import { EModifierSrc, HEAVY_PAs } from "../constants";
import { makeModApplier } from "@Src/calculators/utils";
import { charModCtrlIsActivated, checkCons, talentBuff } from "../utils";

const Dori: DataCharacter = {
  code: 56,
  beta: true,
  name: "Dori",
  icon: "https://i.ibb.co/BfrvTMM/dori.png",
  sideIcon: "",
  rarity: 4,
  nation: "sumeru",
  vision: "electro",
  weapon: "claymore",
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
        { name: "1-Hit", baseMult: 71.21 },
        { name: "2-Hit", baseMult: [33.94, 35.64] },
        { name: "3-Hit", baseMult: 95.29 },
        {
          name: "Heal on Normal Attacks hit (C6)",
          notAttack: "healing",
          conditional: true,
          baseStatType: "hp",
          baseMult: 0,
          multType: 2,
          getTalentBuff: ({ char, selfBuffCtrls }) => {
            const isActivated = charModCtrlIsActivated(Dori.buffs!, char, selfBuffCtrls, 1);

            return talentBuff([isActivated, "mult", [false, 6], 4]);
          },
        },
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
      name: "Spirit-Warding Lamp: Troubleshooter Cannon",
      image: "c/c8/Talent_Spirit-Warding_Lamp_Troubleshooter_Cannon",
      xtraLvAtCons: 5,
      stats: [
        { name: "Troubleshooter Shot DMG", baseMult: 156.24 },
        { name: "After-Sales Service Round DMG", baseMult: 33.48 },
      ],
      // getExtraStats: () => [{ name: "CD", value: "9s" }],
    },
    EB: {
      name: "Alcazarzaray's Exactitude",
      image: "7/77/Talent_Alcazarzaray%27s_Exactitude",
      xtraLvAtCons: 3,
      stats: [
        { name: "Connector DMG", baseMult: 15.88 },
        {
          name: "Continuous Healing",
          notAttack: "healing",
          baseStatType: "hp",
          baseMult: 5.34,
          multType: 2,
          flat: { base: 514, type: 3 },
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
      image: "",
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
      image: "",
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
      image: "",
      desc: (
        <>
          The number of After-Sales Service Rounds created by Troubleshooter Shots is increased by
          1.
        </>
      ),
    },
    {
      name: "Special Franchise",
      image: "",
      desc: (
        <>
          When you are in combat and the Jinni heals the character it is connected to, it will fire
          a Jinni Toop from that character's position that deals 50% of Dori's ATK DMG.
        </>
      ),
    },
    { name: "Wonders Never Cease", image: "" },
    {
      name: "Discretionary Supplement",
      image: "",
      get desc() {
        return (
          <>
            The character connected to the Lamp Spirit will obtain the following buffs based on
            their current HP and Energy: <br />
            When their HP is lower than 50%, they gain <Green b>50%</Green>{" "}
            <Green>Incoming Healing Bonus</Green>. <br />
            When their Energy {this.xtraDesc?.[0]}.
          </>
        );
      },
      xtraDesc: [
        <>
          is less than 50%, they gain <Green b>30%</Green> <Green>Energy Recharge</Green>.
        </>,
      ],
    },
    { name: "Wonders Never Cease", image: "" },
    {
      name: "Sprinkling Weight",
      image: "",
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
      src: EModifierSrc.C4,
      desc: () => (
        <>
          When Energy of the character connected to the Lamp Spirit{" "}
          {Dori.constellation[3].xtraDesc?.[0]}
        </>
      ),
      isGranted: checkCons[4],
      affect: EModAffect.PARTY,
      applyBuff: makeModApplier("totalAttr", "er", 30),
    },
    {
      index: 1,
      src: EModifierSrc.C6,
      desc: () => Dori.constellation[5].desc,
      isGranted: checkCons[6],
      affect: EModAffect.SELF,
      infuseConfig: {
        range: [...NORMAL_ATTACKS],
        overwritable: true,
      },
    },
  ],
};

export default Dori;
