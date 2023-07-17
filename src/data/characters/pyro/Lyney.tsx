import type { DataCharacter, CharInfo, PartyData } from "@Src/types";
import { Green, Rose } from "@Src/pure-components";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { BOW_CAs, EModSrc, LIGHT_PAs } from "../constants";
import { applyPercent, countVision, round } from "@Src/utils";
import { finalTalentLv, applyModifier, makeModApplier } from "@Src/utils/calculation";
import { charModIsInUse, checkAscs, checkCons, talentBuff } from "../utils";

const getPropSurplusValue = (char: CharInfo, partyData: PartyData) => {
  const level = finalTalentLv({ char, dataChar: Lyney, talentType: "ES", partyData });
  return round(53.2 * TALENT_LV_MULTIPLIERS[2][level], 2);
};

const Lyney: DataCharacter = {
  code: 73,
  name: "Lyney",
  icon: "https://images2.imgbox.com/0d/a5/ZREwNoes_o.png",
  sideIcon: "",
  rarity: 5,
  nation: "fontaine",
  vision: "pyro",
  weaponType: "bow",
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
  NAsConfig: {
    name: "Card Force Translocation",
  },
  bonusLvFromCons: ["NAs", "EB"],
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: 38.79 },
        { name: "2-Hit", multFactors: 38.01 },
        { name: "3-Hit (1/2)", multFactors: 27.26 },
        { name: "4-Hit", multFactors: 56.93 },
      ],
    },
    CA: {
      stats: [
        ...BOW_CAs,
        { name: "Props Arrow", subAttPatt: "FCA", multFactors: 172.8 },
        {
          name: "Pyrotechnic Strike",
          multFactors: 212,
          attElmt: "pyro",
          getTalentBuff: ({ char, selfBuffCtrls }) => {
            const isInUse = charModIsInUse(Lyney.buffs!, char, selfBuffCtrls, 1);
            return talentBuff([isInUse, "mult_", [false, 1], 80]);
          },
        },
        {
          name: "Pyrotechnic Strike: Reprised (C6)",
          multFactors: 169.6,
          attElmt: "pyro",
        },
        { name: "Spiritbreath Thorn", multFactors: 28, attElmt: "pyro" },
      ],
      multScale: 2,
    },
    PA: { stats: LIGHT_PAs },
    ES: {
      name: "Bewildering Lights",
      image: "",
      stats: [{ name: "Skill DMG", multFactors: 167.2 }],
    },
    EB: {
      name: "Wondrous Trick: Miracle Parade",
      image: "",
      stats: [
        { name: "Skill DMG", multFactors: 154 },
        { name: "Explosive Firework", multFactors: 414 },
      ],
      energyCost: 60,
    },
  },
  passiveTalents: [
    {
      name: "Perilous Performance",
      image: "",
      desc: (
        <>
          If Lyney consumes HP via firing a Prop Arrow, the Grin-Malkin Hat summoned will deal <Green b>80%</Green> more{" "}
          <Green>ATK</Green> as DMG.
        </>
      ),
    },
    {
      name: "Conclusive Ovation",
      image: "",
      desc: (
        <>
          When dealing DMG to opponents affected by Pyro, Lyney will receive the following buffs:
          <br />• <Green>Base ATK</Green> increased by <Green b>60%</Green>.
          <br />• Each Pyro party member other than Lyney will cause this effect to receive a further{" "}
          <Green b>20%</Green> bonus.
          <br />
          Lyney can gain a total of <Rose>100%</Rose> increased DMG to opponents affected by Pyro in this way.
        </>
      ),
    },
    { name: "Trivial Observations", image: "" },
  ],
  constellation: [
    {
      name: "Whimsical Wonders",
      image: "",
      desc: (
        <>
          Lyney can have 2 Grin-Malkin Hats present at once. Additionally, Prop Arrows will summon 2 Grin-Malkin Hats
          and grant Lyney 1 extra stack of Prop Surplus. This effect can occur once every 15s.
        </>
      ),
    },
    {
      name: "Locquacious Lure",
      image: "",
      desc: (
        <>
          When Lyney is on the field, he will gain a stack of Crisp Focus every 2s. This will increase his{" "}
          <Green>CRIT DMG</Green> by <Green>20%</Green>. Max <Rose>3</Rose> stacks. This effect will be canceled when
          Lyney leaves the field.
        </>
      ),
    },
    { name: "Prestidigitation", image: "" },
    {
      name: "Well-Versed, Well-Rehearsed",
      image: "",
      desc: (
        <>
          After an opponent is hit by Lyney's Pyro Charged Attack, this opponent's <Green>Pyro RES</Green> will be
          decreased by <Green b>20%</Green> for 6s.
        </>
      ),
    },
    { name: "To Pierce Enigmas", image: "" },
    {
      name: "A Contrary Smile",
      image: "",
      desc: (
        <>
          When Lyney fires a Prop Arrow, he will fire a Pyrotechnic Strike: Reprised that will deal 80% of a Pyrotechnic
          Strike's DMG. This DMG is considered Charged Attack DMG.
        </>
      ),
    },
  ],
  buffs: [
    {
      index: 0,
      src: "Prop Surplus",
      affect: EModAffect.SELF,
      desc: ({ char, partyData }) => (
        <>
          Each stack increases Bewildering Lights <Green>[ES] DMG</Green> by{" "}
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
        const bonusValue = getPropSurplusValue(char, partyData) * (inputs[0] || 0);
        applyModifier(desc, attPattBonus, "ES.mult_", bonusValue, tracker);
      },
    },
    {
      index: 1,
      src: EModSrc.A1,
      affect: EModAffect.SELF,
      desc: () => Lyney.passiveTalents[0].desc,
      isGranted: checkAscs[1],
    },
    {
      index: 2,
      src: EModSrc.A4,
      affect: EModAffect.SELF,
      desc: () => Lyney.passiveTalents[1].desc,
      isGranted: checkAscs[4],
      applyBuff: ({ totalAttr, partyData, desc, tracker }) => {
        const { pyro = 0 } = countVision(partyData);
        const percent = Math.min(60 + pyro * 20, 100);
        const buffValue = applyPercent(totalAttr.base_atk, percent);
        const finalDesc = desc + ` / ${percent}% of ${totalAttr.base_atk} Base ATK`;
        applyModifier(finalDesc, totalAttr, "base_atk", buffValue, tracker);
      },
    },
    {
      index: 3,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      desc: () => Lyney.constellation[1].desc,
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
      desc: () => Lyney.constellation[3].desc,
      isGranted: checkCons[1],
      applyDebuff: makeModApplier("resistReduct", "pyro", 20),
    },
  ],
};

export default Lyney;
