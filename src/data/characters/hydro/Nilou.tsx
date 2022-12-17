import type { CharData, DataCharacter, PartyData } from "@Src/types";
import { Green, Lightgold, Red, Rose } from "@Components/atoms";
import { EModAffect } from "@Src/constants";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { round1 } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Calculators/utils";
import { checkAscs, checkCons, countVision, talentBuff } from "../utils";

export function nilouA1isOn(partyData: PartyData, charData: CharData) {
  const { dendro, hydro, ...rest } = countVision(partyData, charData);
  return Boolean(dendro && hydro && !Object.keys(rest).length);
}

export function getNilouA4BuffValue(maxHP: number) {
  return maxHP > 30000 ? round1(Math.min((maxHP / 1000 - 30) * 9, 400)) : 0;
}

const Nilou: DataCharacter = {
  code: 60,
  name: "Nilou",
  icon: "a/a5/Character_Nilou_Thumb",
  sideIcon: "a/a9/Character_Nilou_Side_Icon",
  rarity: 5,
  nation: "sumeru",
  vision: "hydro",
  weaponType: "sword",
  stats: [
    [1182, 18, 57],
    [3066, 46, 147],
    [4080, 62, 196],
    [6105, 92, 293],
    [6825, 103, 327],
    [7852, 119, 377],
    [8813, 133, 423],
    [9850, 149, 473],
    [10571, 160, 507],
    [11618, 176, 557],
    [12338, 187, 592],
    [13397, 203, 643],
    [14117, 213, 677],
    [15185, 230, 729],
  ],
  bonusStat: { type: "hp_", value: 7.2 },
  NAsConfig: {
    name: "Dance of Samser",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multBase: 50.31 },
        { name: "2-Hit", multBase: 45.44 },
        { name: "3-Hit", multBase: 70.35 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack", multBase: [50.22, 54.44] }] },
    PA: { stats: MEDIUM_PAs },
    ES: {
      name: "Dance of Haftkarsvar",
      image: "3/3e/Talent_Dance_of_Haftkarsvar",
      xtraLvAtCons: 5,
      stats: [
        { name: "Skill DMG", baseStatType: "hp", multBase: 3.34 },
        { name: "Sword Dance 1-Hit DMG", baseStatType: "hp", multBase: 4.55 },
        { name: "Sword Dance 2-Hit DMG", baseStatType: "hp", multBase: 5.14 },
        {
          name: "Watery Moon DMG",
          baseStatType: "hp",
          multBase: 7.17,
          getTalentBuff: ({ char }) => talentBuff([checkCons[1](char), "pct", [false, 1], 65]),
        },
        { name: "Whirling Steps 1-Hit DMG", baseStatType: "hp", multBase: 3.26 },
        { name: "Whirling Steps 2-Hit DMG", baseStatType: "hp", multBase: 3.96 },
        { name: "Water Wheel DMG", baseStatType: "hp", multBase: 5.06 },
      ],
      // getExtraStats: () => [
      //   { name: "Pirouette Duration", value: "10s" },
      //   { name: "Lunar Prayer Duration", value: "8s" },
      //   { name: "Tranquility Aura Duration", value: "12s" },
      //   { name: "CD", value: "18s" },
      // ],
    },
    EB: {
      name: "Dance of Abzendegi: Distant Dreams, Listening Spring",
      image: "b/b9/Talent_Dance_of_Abzendegi_Distant_Dreams%2C_Listening_Spring",
      xtraLvAtCons: 3,
      stats: [
        { name: "Skill DMG", baseStatType: "hp", multBase: 18.43 },
        { name: "Lingering Aeon DMG", baseStatType: "hp", multBase: 22.53 },
      ],
      // getExtraStats: () => [{ name: "CD", value: "18s" }],
      energyCost: 70,
    },
  },
  passiveTalents: [
    {
      name: "Court of Dancing Petals",
      image: "7/74/Talent_Court_of_Dancing_Petals",
      get desc() {
        return (
          <>
            When all characters in the party are either Dendro or Hydro, and there is at least one
            Dendro and Hydro character, the flowery steps of Nilou's Dance of Haftkarsvar will grant
            all nearby characters the Golden Chalice's Bounty for 30s.
            <br />
            {this.xtraDesc![0]}
            <br />
            Such Cores will burst very quickly after being created, and they have larger AoEs.
            <br />
            Bountiful Cores cannot trigger Hyperbloom or Burgeon, and they share a upper numerical
            limit with Dendro Cores. Bountiful Core DMG is considered DMG dealt by Dendro Cores
            produced by Bloom.
          </>
        );
      },
      xtraDesc: [
        <>
          Characters under the effect of Golden Chalice's Bounty will have their{" "}
          <Green>Elemental Mastery</Green> increased by <Green b>100</Green> for 10s whenever they
          are hit by Dendro attacks. Also, triggering the Bloom reaction will create Bountiful Cores
          instead of Dendro Cores.
        </>,
      ],
    },
    {
      name: "Dreamy Dance of Aeons",
      image: "6/60/Talent_Dreamy_Dance_of_Aeons",
      desc: (
        <>
          Each 1,000 points of Max HP above 30,000 will cause the <Green>DMG</Green> dealt by{" "}
          <Green>Bountiful Cores</Green> created by characters affected by Golden Chalice's Bounty
          to increase by <Green b>9%</Green>.
          <br />
          The <Green>maximum</Green> increase in Bountiful Core DMG that can be achieved this way is{" "}
          <Green b>400%</Green>.
        </>
      ),
    },
    { name: "White Jade Lotus", image: "3/39/Talent_White_Jade_Lotus" },
  ],
  constellation: [
    {
      name: "Dance of the Waning Moon",
      image: "0/0a/Constellation_Dance_of_the_Waning_Moon",
      get desc() {
        return (
          <>
            Dance of Haftkarsvar will be enhanced as follows:
            <br />• {this.xtraDesc![0]}
            <br />• The Tranquility Aura's duration is extended by 6s.
          </>
        );
      },
      xtraDesc: [
        <>
          <Green>Watery moon DMG</Green> is increased by <Green b>65%</Green>.
        </>,
      ],
    },
    {
      name: "The Starry Skies Their Flowers Rain",
      image: "0/09/Constellation_The_Starry_Skies_Their_Flowers_Rain",
      get desc() {
        return (
          <>
            {this.xtraDesc![0]} {this.xtraDesc![1]}
            <br />
            You need to have unlocked the "Court of Dancing Petals" Talent.
          </>
        );
      },
      xtraDesc: [
        <>
          After characters affected by the Golden Chalice's Bounty deal Hydro DMG to opponents, that
          opponent's <Green>Hydro RES</Green> will be decreased by <Green b>35%</Green> for 10s.
        </>,
        <>
          After a triggered Bloom reaction deals DMG to opponents, their <Green>Dendro RES</Green>{" "}
          will be decreased by <Green b>35%</Green> for 10s.
        </>,
      ],
    },
    { name: "Beguiling Shadowstep", image: "6/60/Constellation_Beguiling_Shadowstep" },
    {
      name: "Fricative Pulse",
      image: "1/1e/Constellation_Fricative_Pulse",
      get desc() {
        return (
          <>
            After the third dance step of Dance of Haftkarsvar' Pirouette hits opponents, Nilou will
            gain 15 Elemental Energy, and {this.xtraDesc![0]}
          </>
        );
      },
      xtraDesc: [
        <>
          <Green>DMG</Green> from her{" "}
          <Green>Dance of the Lotus: Distant Dreams, Listening Spring</Green> will be increased by{" "}
          <Green b>50%</Green> for 8s.
        </>,
      ],
    },
    { name: "Twirling Light", image: "a/a2/Constellation_Twirling_Light" },
    {
      name: "Frostbreaker's Melody",
      image: "9/93/Constellation_Frostbreaker%27s_Melody",
      desc: (
        <>
          For every 1,000 points of Max HP, Nilou's <Green>CRIT Rate</Green> and{" "}
          <Green>CRIT DMG</Green> will increase by <Green b>0.6%</Green> and <Green b>1.2%</Green>{" "}
          respectively.
          <br />
          The maximum increase in <Green>CRIT Rate</Green> and <Green>CRIT DMG</Green> is{" "}
          <Green b>30%</Green> and <Green b>60%</Green> respectively.
        </>
      ),
    },
  ],
  innateBuffs: [
    {
      src: EModSrc.C1,
      isGranted: checkCons[1],
      desc: () => Nilou.constellation[0].xtraDesc?.[0],
    },
    {
      src: EModSrc.C4,
      isGranted: checkCons[4],
      desc: () => Nilou.constellation[3].xtraDesc?.[0],
      applyBuff: makeModApplier("attPattBonus", "EB.pct", 50),
    },
    {
      src: EModSrc.C6,
      desc: () => Nilou.constellation[5].desc,
      isGranted: checkCons[6],
      applyFinalBuff: ({ totalAttr, desc, tracker }) => {
        const baseValue = round1(Math.min((totalAttr.hp / 1000) * 0.6, 30));
        const buffValues = [baseValue, baseValue * 2];
        applyModifier(desc, totalAttr, ["cRate", "cDmg"], buffValues, tracker);
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: "Golden Chalice's Bounty",
      desc: ({ toSelf, totalAttr, inputs = [] }) => (
        <>
          Increases characters' <Green>Elemental Mastery</Green> by <Green b>100</Green> for 10s
          whenever they are hit by Dendro attacks. Also, triggering Bloom reaction will create
          Bountiful Cores instead of Dendro Cores.
          <br />• At <Lightgold>A4</Lightgold>, each 1,000 points of Nilou <Green>Max HP</Green>{" "}
          above 30,000 will cause <Green>Bountiful Cores DMG</Green> to increase by{" "}
          <Green>9%</Green>. Maximum <Rose>400%</Rose>.{" "}
          <Red>Bonus DMG: {getNilouA4BuffValue(toSelf ? totalAttr.hp : inputs[0] ?? 0)}%.</Red>
        </>
      ),
      isGranted: checkAscs[1],
      affect: EModAffect.PARTY,
      inputConfigs: [
        {
          label: "Max HP (A4)",
          type: "text",
          max: 99999,
          for: "teammate",
        },
      ],
      applyBuff: ({ totalAttr, charData, partyData, desc, tracker }) => {
        if (nilouA1isOn(partyData, charData)) {
          applyModifier(desc, totalAttr, "em", 100, tracker);
        }
      },
      applyFinalBuff: ({ toSelf, totalAttr, rxnBonus, inputs, char, desc, tracker }) => {
        if (toSelf ? checkAscs[4](char) : inputs[0]) {
          const buffValue = getNilouA4BuffValue(toSelf ? totalAttr.hp : inputs[0]);
          applyModifier(desc, rxnBonus, "bloom.pct", buffValue, tracker);
        }
      },
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C2,
      desc: () => Nilou.constellation[1].xtraDesc?.[0],
      isGranted: checkCons[2],
      applyDebuff: makeModApplier("resistReduct", "hydro", 35),
    },
    {
      index: 1,
      src: EModSrc.C2,
      desc: () => Nilou.constellation[1].xtraDesc?.[1],
      isGranted: checkCons[2],
      applyDebuff: makeModApplier("resistReduct", "dendro", 35),
    },
  ],
};

export default Nilou;
