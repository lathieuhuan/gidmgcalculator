import type { AppCharacter, CharInfo, DefaultAppCharacter, PartyData } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { Green, Rose } from "@Src/pure-components";
import { countVision, round } from "@Src/utils";
import { applyModifier, finalTalentLv, makeModApplier } from "@Src/utils/calculation";
import { BOW_CAs, EModSrc, LIGHT_PAs } from "../constants";
import { checkAscs, checkCons, exclBuff } from "../utils";

const getPropSurplusValue = (char: CharInfo, partyData: PartyData) => {
  const level = finalTalentLv({ char, charData: Lyney as AppCharacter, talentType: "ES", partyData });
  return round(53.2 * TALENT_LV_MULTIPLIERS[2][level], 2);
};

const Lyney: DefaultAppCharacter = {
  code: 73,
  name: "Lyney",
  icon: "https://images2.imgbox.com/0d/a5/ZREwNoes_o.png",
  sideIcon: "",
  rarity: 5,
  nation: "fontaine",
  vision: "pyro",
  weaponType: "bow",
  EBcost: 60,
  talentLvBonusAtCons: {
    NAs: 3,
    EB: 5,
  },
  stats: [
    [858, 25, 42],
    [2226, 64, 109],
    [2961, 85, 145],
    [4431, 128, 216],
    [4954, 143, 242],
    [5699, 165, 278],
    [6396, 185, 312],
    [7150, 206, 349],
    [7672, 221, 375],
    [8432, 243, 412],
    [8955, 258, 437],
    [9724, 281, 475],
    [10247, 296, 500],
    [11021, 318, 538],
  ],
  bonusStat: { type: "cRate_", value: 4.8 },
  calcListConfig: {
    CA: { multScale: 2 },
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 38.79 },
      { name: "2-Hit", multFactors: 38.01 },
      { name: "3-Hit (1/2)", multFactors: 27.26 },
      { name: "4-Hit", multFactors: 56.93 },
    ],
    CA: [
      ...BOW_CAs,
      { name: "Props Arrow", subAttPatt: "FCA", multFactors: 172.8 },
      {
        id: "CA.0",
        name: "Pyrotechnic Strike",
        multFactors: 212,
        attElmt: "pyro",
      },
      {
        name: "Pyrotechnic Strike: Reprised (C6)",
        multFactors: 169.6,
        attElmt: "pyro",
      },
      { name: "Spiritbreath Thorn", multFactors: 28, attElmt: "pyro" },
    ],
    PA: LIGHT_PAs,
    ES: [
      {
        name: "Skill DMG",
        multFactors: 167.2,
      },
    ],
    EB: [
      { name: "Skill DMG", multFactors: 154 },
      { name: "Explosive Firework", multFactors: 414 },
    ],
  },
  activeTalents: {
    NAs: {
      name: "Card Force Translocation",
    },
    ES: {
      name: "Bewildering Lights",
      image: "",
    },
    EB: {
      name: "Wondrous Trick: Miracle Parade",
      image: "",
    },
  },
  passiveTalents: [
    {
      name: "Perilous Performance",
      image: "",
      description:
        "If Lyney consumes HP when firing off a Prop Arrow, the Grin-Malkin hat summoned by the arrow will, upon hitting an opponent, restore 3 Energy to Lyney and increase DMG dealt by 80% of his ATK.",
    },
    {
      name: "Conclusive Ovation",
      image: "",
      description:
        "When dealing DMG to opponents affected by Pyro, Lyney will receive the following buffs:\n• Base ATK increased by 60%.\n• Each Pyro party member other than Lyney will cause this effect to receive a further 20% bonus.\nLyney can gain a total of 100% increased DMG to opponents affected by Pyro in this way.",
    },
    { name: "Trivial Observations", image: "" },
  ],
  constellation: [
    {
      name: "Whimsical Wonders",
      image: "",
      description:
        "Lyney can have 2 Grin-Malkin Hats present at once. Additionally, Prop Arrows will summon 2 Grin-Malkin Hats and grant Lyney 1 extra stack of Prop Surplus. This effect can occur once every 15s.",
    },
    {
      name: "Locquacious Lure",
      image: "",
      description:
        "When Lyney is on the field, he will gain a stack of Crisp Focus every 2s. This will increase his CRIT DMG by 20%. Max 3 stacks. This effect will be canceled when Lyney leaves the field.",
    },
    { name: "Prestidigitation", image: "" },
    {
      name: "Well-Versed, Well-Rehearsed",
      image: "",
      description:
        "After an opponent is hit by Lyney's Pyro Charged Attack, this opponent's Pyro RES will be decreased by 20% for 6s.",
    },
    { name: "To Pierce Enigmas", image: "" },
    {
      name: "A Contrary Smile",
      image: "",
      description:
        "When Lyney fires a Prop Arrow, he will fire a Pyrotechnic Strike: Reprised that will deal 80% of a Pyrotechnic Strike's DMG. This DMG is considered Charged Attack DMG.",
    },
  ],
  buffs: [
    {
      index: 0,
      src: "Prop Surplus",
      affect: EModAffect.SELF,
      desc: ({ char, partyData }) => (
        <>
          Each stack increases Bewildering Lights {[ES] DMG}#[gr] by{" "}
          <Green b>{getPropSurplusValue(char, partyData)}% ATK</Green>.
        </>
      ),
      inputConfigs: [
        {
          type: "stacks",
          max: 5,
        },
      ],
      applyBuff: ({ attPattBonus, char, partyData, inputs, desc, tracker }) => {
        const buffValue = getPropSurplusValue(char, partyData) * (inputs[0] || 0);
        applyModifier(desc, attPattBonus, "ES.mult_", buffValue, tracker);
      },
    },
    {
      index: 1,
      src: EModSrc.A1,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          If Lyney consumes HP via firing a Prop Arrow, the Grin-Malkin Hat summoned will deal {80%}#[b,gr] more{" "}
          {ATK}#[gr] as DMG.
        </>
      ),
      isGranted: checkAscs[1],
      applyBuff: ({ calcItemBuffs }) => {
        calcItemBuffs.push(exclBuff(EModSrc.A1, "CA.0", "mult_", 80));
      },
    },
    {
      index: 2,
      src: EModSrc.A4,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          When dealing DMG to opponents affected by Pyro, Lyney will receive the following buffs:
          <br />• Increases the {DMG}#[gr] dealt by {60%}#[b,gr].
          <br />• Each Pyro party member other than Lyney will cause the DMG dealt to increase by an additional{" "}
          {20%}#[b,gr].
          <br />
          Lyney can deal up to <Rose>100%</Rose> increased DMG to opponents affected by Pyro in this way.
        </>
      ),
      isGranted: checkAscs[4],
      applyBuff: ({ attPattBonus, partyData, desc, tracker }) => {
        const { pyro = 0 } = countVision(partyData);
        const buffValue = Math.min(60 + pyro * 20, 100);
        applyModifier(desc, attPattBonus, "all.pct_", buffValue, tracker);
      },
    },
    {
      index: 3,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          When Lyney is on the field, he will gain a stack of Crisp Focus every 2s. This will increase his{" "}
          {CRIT DMG}#[gr] by <Green>20%</Green>. Max {3}#[r] stacks. This effect will be canceled when
          Lyney leaves the field.
        </>
      ),
      isGranted: checkCons[2],
      inputConfigs: [
        {
          type: "stacks",
          max: 3,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        applyModifier(desc, totalAttr, "cDmg_", (inputs[0] || 0) * 20, tracker);
      },
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C4,
      desc: () => (
        <>
          After an opponent is hit by Lyney's Pyro Charged Attack, this opponent's <Green>Pyro RES</Green> will be
          decreased by {20%}#[b,gr] for 6s.
        </>
      ),
      isGranted: checkCons[1],
      applyDebuff: makeModApplier("resistReduct", "pyro", 20),
    },
  ],
};

export default Lyney as AppCharacter;
