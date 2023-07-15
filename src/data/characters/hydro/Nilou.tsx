import type { CharData, AppCharacter, PartyData } from "@Src/types";
import { Green, Lightgold, Red, Rose } from "@Src/pure-components";
import { EModAffect } from "@Src/constants";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { round, countVision } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { checkAscs, checkCons, talentBuff } from "../utils";

function A1isOn(partyData: PartyData, charData: CharData) {
  const { dendro, hydro, ...rest } = countVision(partyData, charData);
  return Boolean(dendro && hydro && !Object.keys(rest).length);
}

function getA4BuffValue(maxHP: number) {
  const stacks = maxHP / 1000 - 30;
  return stacks > 0 ? round(Math.min(stacks * 9, 400), 1) : 0;
}

const Nilou: AppCharacter = {
  code: 60,
  name: "Nilou",
  icon: "5/58/Nilou_Icon",
  sideIcon: "c/c3/Nilou_Side_Icon",
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
  isReverseXtraLv: true,
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: 50.31 },
        { name: "2-Hit", multFactors: 45.44 },
        { name: "3-Hit", multFactors: 70.35 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack", multFactors: [50.22, 54.44] }] },
    PA: { stats: MEDIUM_PAs },
    ES: {
      name: "Dance of Haftkarsvar",
      image: "3/3e/Talent_Dance_of_Haftkarsvar",
      stats: [
        { name: "Skill DMG", multFactors: 3.34 },
        { name: "Sword Dance 1-Hit DMG", multFactors: 4.55 },
        { name: "Sword Dance 2-Hit DMG", multFactors: 5.14 },
        {
          name: "Watery Moon DMG",
          multFactors: 7.17,
          getTalentBuff: ({ char }) => talentBuff([checkCons[1](char), "pct_", [false, 1], 65]),
        },
        { name: "Whirling Steps 1-Hit DMG", multFactors: 3.26 },
        { name: "Whirling Steps 2-Hit DMG", multFactors: 3.96 },
        { name: "Water Wheel DMG", multFactors: 5.06 },
      ],
      multAttributeType: "hp",
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
      stats: [
        { name: "Skill DMG", multFactors: 18.43 },
        { name: "Lingering Aeon DMG", multFactors: 22.53 },
      ],
      multAttributeType: "hp",
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
            When all characters in the party are either Dendro or Hydro, and there is at least one Dendro and Hydro
            character, the flowery steps of Nilou's Dance of Haftkarsvar will grant all nearby characters the Golden
            Chalice's Bounty for 30s.
            <br />
            {this.xtraDesc![0]}
            <br />
            Such Cores will burst very quickly after being created, and they have larger AoEs.
            <br />
            Bountiful Cores cannot trigger Hyperbloom or Burgeon, and they share a upper numerical limit with Dendro
            Cores. Bountiful Core DMG is considered DMG dealt by Dendro Cores produced by Bloom.
          </>
        );
      },
      xtraDesc: [
        <>
          Characters under the effect of Golden Chalice's Bounty will have their <Green>Elemental Mastery</Green>{" "}
          increased by <Green b>100</Green> for 10s whenever they are hit by Dendro attacks. Also, triggering the Bloom
          reaction will create Bountiful Cores instead of Dendro Cores.
        </>,
      ],
    },
    {
      name: "Dreamy Dance of Aeons",
      image: "6/60/Talent_Dreamy_Dance_of_Aeons",
      desc: (
        <>
          Each 1,000 points of Max HP above 30,000 will cause the <Green>DMG</Green> dealt by{" "}
          <Green>Bountiful Cores</Green> created by characters affected by Golden Chalice's Bounty to increase by{" "}
          <Green b>9%</Green>.
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
          After characters affected by the Golden Chalice's Bounty deal Hydro DMG to opponents, that opponent's{" "}
          <Green>Hydro RES</Green> will be decreased by <Green b>35%</Green> for 10s.
        </>,
        <>
          After a triggered Bloom reaction deals DMG to opponents, their <Green>Dendro RES</Green> will be decreased by{" "}
          <Green b>35%</Green> for 10s.
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
            After the third dance step of Dance of Haftkarsvar' Pirouette hits opponents, Nilou will gain 15 Elemental
            Energy, and {this.xtraDesc![0]}
          </>
        );
      },
      xtraDesc: [
        <>
          Dance of the Lotus: Distant Dreams, Listening Spring <Green>[EB] DMG</Green> will be increased by{" "}
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
          For every 1,000 points of Max HP, Nilou's <Green>CRIT Rate</Green> is increased by <Green b>0.6%</Green> (max{" "}
          <Rose>30%</Rose>) and her <Green>CRIT DMG</Green> is increase by <Green b>1.2%</Green> (max <Rose>60%</Rose>).
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
      src: EModSrc.C6,
      desc: () => Nilou.constellation[5].desc,
      isGranted: checkCons[6],
      applyFinalBuff: ({ totalAttr, desc, tracker }) => {
        const baseValue = round(Math.min((totalAttr.hp / 1000) * 0.6, 30), 1);
        const buffValues = [baseValue, baseValue * 2];
        applyModifier(desc, totalAttr, ["cRate_", "cDmg_"], buffValues, tracker);
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: "Golden Chalice's Bounty",
      affect: EModAffect.PARTY,
      desc: ({ toSelf, totalAttr, inputs }) => (
        <>
          Increases characters' <Green>Elemental Mastery</Green> by <Green b>100</Green> for 10s whenever they are hit
          by Dendro attacks. Also, triggering Bloom reaction will create Bountiful Cores instead of Dendro Cores.
          <br />• At <Lightgold>A4</Lightgold>, each 1,000 points of Nilou <Green>Max HP</Green> above 30,000 will cause{" "}
          <Green>Bountiful Cores DMG</Green> to increase by <Green>9%</Green>. Maximum <Rose>400%</Rose>.{" "}
          <Red>DMG bonus: {getA4BuffValue(toSelf ? totalAttr.hp : inputs[0] ?? 0)}%.</Red>
        </>
      ),
      isGranted: checkAscs[1],
      inputConfigs: [
        {
          label: "Max HP (A4)",
          type: "text",
          max: 99999,
          for: "teammate",
        },
      ],
      applyBuff: ({ totalAttr, charData, partyData, desc, tracker }) => {
        if (A1isOn(partyData, charData)) {
          applyModifier(desc, totalAttr, "em", 100, tracker);
        }
      },
      applyFinalBuff: ({ toSelf, totalAttr, rxnBonus, inputs, char, desc, tracker }) => {
        if (toSelf ? checkAscs[4](char) : inputs[0]) {
          const buffValue = getA4BuffValue(toSelf ? totalAttr.hp : inputs[0]);
          applyModifier(desc, rxnBonus, "bloom.pct_", buffValue, tracker);
        }
      },
    },
    {
      index: 3,
      src: EModSrc.C4,
      affect: EModAffect.SELF,
      desc: () => (
        <>After the third dance step of Pirouette state [~ES] hits opponents, {Nilou.constellation[3].xtraDesc?.[0]}</>
      ),
      applyBuff: makeModApplier("attPattBonus", "EB.pct_", 50),
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
