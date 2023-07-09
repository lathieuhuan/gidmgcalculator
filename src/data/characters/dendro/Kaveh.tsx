import type { DataCharacter } from "@Src/types";
import { Dendro, Green, Lightgold, Rose } from "@Src/pure-components";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { EModSrc, HEAVY_PAs } from "../constants";
import { round } from "@Src/utils";
import { applyModifier, finalTalentLv, makeModApplier } from "@Src/utils/calculation";
import { checkAscs, checkCons } from "../utils";

const getEBbuffValue = (level: number) => (level ? round(27.49 * TALENT_LV_MULTIPLIERS[2][level], 2) : 0);

const Kaveh: DataCharacter = {
  code: 69,
  name: "Kaveh",
  icon: "1/1f/Kaveh_Icon",
  sideIcon: "5/5e/Kaveh_Side_Icon",
  rarity: 4,
  nation: "sumeru",
  vision: "dendro",
  weaponType: "claymore",
  stats: [
    [1003, 20, 63],
    [2577, 50, 162],
    [3326, 65, 209],
    [4982, 97, 213],
    [5514, 108, 346],
    [6343, 124, 398],
    [7052, 138, 443],
    [7881, 154, 495],
    [8413, 164, 528],
    [9241, 180, 580],
    [9773, 191, 613],
    [10602, 207, 665],
    [11134, 217, 699],
    [11962, 234, 751],
  ],
  bonusStat: { type: "em", value: 24 },
  NAsConfig: {
    name: "Schematic Setup",
  },
  bonusLvFromCons: ["EB", "ES"],
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: 76.19 },
        { name: "2-Hit", multFactors: 69.64 },
        { name: "3-Hit", multFactors: 84.26 },
        { name: "4-Hit", multFactors: 102.69 },
      ],
    },
    CA: {
      stats: [
        { name: "Charged Attack Cyclic", multFactors: 53.15 },
        { name: "Charged Attack Final", multFactors: 96.15 },
      ],
    },
    PA: { stats: HEAVY_PAs },
    ES: {
      name: "Artistic Ingenuity",
      image: "0/0b/Talent_Artistic_Ingenuity",
      stats: [{ name: "Skill DMG", multFactors: 204 }],
    },
    EB: {
      name: "Painted Dome",
      image: "2/28/Talent_Painted_Dome",
      stats: [
        { name: "Skill DMG", multFactors: 160 },
        {
          name: "Light of the Firmament (C6)",
          multFactors: { root: 61.8, scale: 0 },
          attPatt: "none",
        },
      ],
      energyCost: 80,
    },
  },
  passiveTalents: [
    {
      name: "An Architect's Undertaking",
      image: "a/a6/Talent_An_Architect%27s_Undertaking",
      desc: (
        <>
          When DMG dealt by a Dendro Core (including Burgeon and Hyperbloom) hits Kaveh, he will regain HP equal to 300%
          of his Elemental Mastery. This effect can be triggered once every 0.5s.
        </>
      ),
    },
    {
      name: "A Craftsman's Curious Conceptions",
      image: "d/d1/Talent_A_Craftsman%27s_Curious_Conceptions",
      get desc() {
        return (
          <>
            During Painted Dome [EB], {this.xtraDesc?.[0]} This effect can be triggered once every 0.1s.
            <br />
            This effect will be canceled when Painted Dome's effects end.
          </>
        );
      },
      xtraDesc: [
        <>
          after Kaveh's Normal, Charged, and Plunging Attacks hit opponents, his <Green>Elemental Mastery</Green> will
          increase by <Green b>25</Green>. Max <Rose>4</Rose> stacks.
        </>,
      ],
    },
    {
      name: "The Art of Budgeting",
      image: "4/41/Talent_The_Art_of_Budgeting",
    },
  ],
  constellation: [
    {
      name: "Sublime Salutations",
      image: "1/14/Constellation_Sublime_Salutations",
      desc: (
        <>
          Within 3.5s after using Artistic Ingenuity [ES], Kaveh's Dendro RES and Incoming Healing Bonus will be
          increased by 50% and 25% respectively.
        </>
      ),
    },
    {
      name: "Grace of Royal Roads",
      image: "2/28/Constellation_Grace_of_Royal_Roads",
      desc: (
        <>
          Kaveh's <Green>Normal Attack SPD</Green> increases by <Green b>15%</Green> during Painted Dome [EB].
        </>
      ),
    },
    { name: "Profferings of Dur Untash", image: "a/a7/Constellation_Profferings_of_Dur_Untash" },
    {
      name: "Feast of Apadana",
      image: "c/ca/Constellation_Feast_of_Apadana",
      desc: (
        <>
          Dendro Cores created from <Green>Bloom</Green> reactions Kaveh triggers will deal <Green b>60%</Green> more
          DMG when they burst.
        </>
      ),
    },
    { name: "Treasures of Bonkhanak", image: "f/f6/Constellation_Treasures_of_Bonkhanak" },
    {
      name: "Pairidaeza's Dreams",
      image: "6/61/Constellation_Pairidaeza%27s_Dreams",
      desc: (
        <>
          When Kaveh's Normal, Charged, and Plunging Attacks hit opponents during Painted Dome [EB], it will unleash the
          Light of the Firmament upon the opponent's position, dealing <Green b>61.8%</Green> of Kaveh's{" "}
          <Green>ATK</Green> as AoE Dendro DMG and causing all Dendro Cores within that AoE to rupture. This effect can
          be triggered once every 3s.
        </>
      ),
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      affect: EModAffect.SELF,
      desc: (args) => {
        const level = finalTalentLv({ ...args, dataChar: Kaveh, talentType: "EB" });
        return (
          <>
            • Grants <Dendro>Dendro Infusion</Dendro>.<br />• Increases Bloom DMG triggered by all party members by{" "}
            <Green b>{getEBbuffValue(level)}%</Green>.
            <br />• At <Lightgold>A4</Lightgold>, {Kaveh.passiveTalents[1].xtraDesc?.[0]}
            <br />• At <Lightgold>C2</Lightgold>, {Kaveh.constellation[1].desc}
          </>
        );
      },
      inputConfigs: [
        {
          label: "A4 stacks",
          type: "stacks",
          initialValue: 0,
          max: 4,
        },
      ],
      applyBuff: ({ totalAttr, rxnBonus, char, partyData, inputs, desc, tracker }) => {
        const level = finalTalentLv({ char, dataChar: Kaveh, talentType: "EB", partyData });

        applyModifier(desc, rxnBonus, "bloom.pct_", getEBbuffValue(level), tracker);

        if (checkAscs[4](char)) {
          const stacks = inputs[0];
          applyModifier(desc + ` / ${EModSrc.A4}`, totalAttr, "em", stacks * 25);
        }
        if (checkCons[2](char)) {
          applyModifier(desc + ` / ${EModSrc.C2}`, totalAttr, "naAtkSpd_", 15);
        }
      },
      infuseConfig: {
        overwritable: false,
      },
    },
    {
      index: 1,
      src: EModSrc.EB,
      affect: EModAffect.TEAMMATE,
      desc: ({ inputs }) => (
        <>
          Increases Bloom DMG triggered by all party members by <Green b>{getEBbuffValue(inputs[0])}%</Green>.
        </>
      ),
      inputConfigs: [
        {
          label: "Elemental Burst level",
          type: "level",
          for: "teammate",
        },
      ],
      applyBuff: ({ rxnBonus, inputs, desc, tracker }) => {
        applyModifier(desc, rxnBonus, "bloom.pct_", getEBbuffValue(inputs[0]), tracker);
      },
    },
    {
      index: 2,
      src: EModSrc.C4,
      affect: EModAffect.SELF,
      isGranted: checkCons[4],
      desc: () => Kaveh.constellation[3].desc,
      applyBuff: makeModApplier("rxnBonus", "bloom.pct_", 60),
    },
  ],
};

export default Kaveh;
