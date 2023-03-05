import type { DataCharacter } from "@Src/types";
import { Green } from "@Components/atoms";
import { EModAffect } from "@Src/constants";
import { EModSrc, LIGHT_PAs } from "../constants";
import { applyModifier, makeModApplier, ReactionBonusPath } from "@Src/utils/calculation";
import { checkAscs, checkCons, talentBuff } from "../utils";

const Baizhu: DataCharacter = {
  code: 70,
  beta: true,
  name: "Baizhu",
  icon: "https://i.ibb.co/s3jLxJz/baizhu.png",
  sideIcon: "",
  rarity: 5,
  nation: "liyue",
  vision: "dendro",
  weaponType: "catalyst",
  stats: [
    [2695, 39, 101],
    [3586, 52, 134],
    [5366, 77, 201],
    [4165, 120, 253],
    [5999, 87, 225],
    [6902, 100, 258],
    [7747, 112, 290],
    [8659, 125, 324],
    [9292, 134, 348],
    [10213, 147, 382],
    [10846, 156, 406],
    [11777, 170, 441],
    [12410, 179, 464],
    [13348, 193, 500],
  ],
  bonusStat: { type: "hp_", value: 7.2 },
  NAsConfig: {
    name: "Gilded Acupuncture",
  },
  isReverseXtraLv: true,
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: 37.37 },
        { name: "2-Hit", multFactors: 36.42 },
        { name: "3-Hit (x2)", multFactors: 22.54 },
        { name: "4-Hit", multFactors: 54.14 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack", multFactors: 121.04 }] },
    PA: { stats: LIGHT_PAs },
    ES: {
      name: "Universal Diagnosis",
      image: "",
      stats: [
        { name: "Skill DMG", multFactors: 79.2 },
        { name: "Healing", multFactors: { root: 9.6, attributeType: "hp" }, flatFactor: 924 },
        {
          name: "Gossamer Sprite: Splice DMG (C2)",
          multFactors: { root: 237.6, scale: 0 },
          flatFactor: 924,
        },
        {
          name: "Gossamer Sprite: Splice Healing (C2)",
          multFactors: { root: 1.92, attributeType: "hp" },
          flatFactor: 185,
        },
      ],
    },
    EB: {
      name: "Healing Holism",
      image: "",
      stats: [
        {
          name: "Seamless Shield DMG Absorption",
          multFactors: { root: 0.8, attributeType: "hp" },
          flatFactor: 77,
        },
        {
          name: "Spiritvein Healing",
          multFactors: { root: 5.2, attributeType: "hp" },
          flatFactor: 501,
        },
        {
          name: "Spiritvein DMG",
          multFactors: 80.96,
          getTalentBuff: ({ char, totalAttr }) => {
            const buffValue = Math.round(totalAttr.hp / 10);
            return talentBuff([checkCons[6](char), "flat", [false, 6], buffValue]);
          },
        },
      ],
      energyCost: 80,
    },
  },
  passiveTalents: [
    { name: "Five Fortunes Forever", image: "" },
    { name: "All Things Are of the Earth", image: "" },
    { name: "Herbal Nourishment", image: "" },
  ],
  constellation: [
    {
      name: "Even the Slightest Groan",
      image: "",
      desc: <>Universal Diagnosis [ES] gains 1 additional charge.</>,
    },
    {
      name: "Skilled of Hand",
      image: "",
      desc: (
        <>
          When Baizhu's active party member hits an opponent with their attacks, Baizhu will use
          Gossamer Sprite: Splice that deals 300% Dendro DMG and 20% of Universal Diagnosis' [ES]
          healing.
          <br />
          This effect can be triggered once every 5s.
        </>
      ),
    },
    { name: "All Aspects Stabilized", image: "" },
    {
      name: "Ancient Perception",
      image: "",
      desc: (
        <>
          For 15s after Healing Holism [EB] is used, Baizhu will increase all nearby party members'{" "}
          <Green>Elemental Mastery</Green> by <Green b>80</Green>.
        </>
      ),
    },
    { name: "Hidden Shifting Signs", image: "" },
    {
      name: "Aura Flow",
      image: "",
      get desc() {
        return (
          <>
            {this.xtraDesc?.[0]} Additionally, when Gossamer Sprite or Gossamer Sprite: Splice [ES]
            hit opponents, there is a 100% chance of generating one of Seamless Shields [~EB]. This
            effect can only be triggered once by a Gossamer Sprite or Gossamer Sprite: Splice.
          </>
        );
      },
      xtraDesc: [
        <>
          Increases <Green>Spiritveins [~EB] DMG</Green> by <Green b>10%</Green> of Baizhu's{" "}
          <Green>Max HP</Green>.
        </>,
      ],
    },
  ],
  innateBuffs: [
    {
      src: EModSrc.C6,
      desc: () => Baizhu.constellation[5].xtraDesc?.[0],
      isGranted: checkCons[6],
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.SELF,
      isGranted: checkAscs[1],
      desc: () => (
        <>
          Baizhu gains different effects according to the current HP of your current active
          character:
          <br />• When their HP is less than 50%, Baizhu gains <Green b>20%</Green>{" "}
          <Green>Healing Bonus</Green>.
          <br />• When their HP is equal to or more than 50%, Baizhu gains <Green b>25%</Green>{" "}
          <Green>Dendro DMG Bonus</Green>.
        </>
      ),
      inputConfigs: [{ label: "HP less than 50%", type: "check" }],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        if (inputs[0]) {
          applyModifier(desc, totalAttr, "healB_", 20, tracker);
        } else {
          applyModifier(desc, totalAttr, "dendro", 25, tracker);
        }
      },
    },
    {
      index: 1,
      src: EModSrc.A4,
      affect: EModAffect.PARTY,
      isGranted: checkAscs[4],
      desc: () => (
        <>
          Characters healed by Healing Holism [EB] will gain the Year of Verdant Favor effect: Each
          1,000 Max HP that Baizhu possesses below 50,000 will increase their{" "}
          <Green>Burning, Bloom, Hyperbloom, and Burgeon DMG</Green> by <Green b>2%</Green>, while
          their <Green>Aggravate and Spread DMG</Green> will be increased by <Green b>0.8%</Green>.
          This effect lasts 6s.
        </>
      ),
      inputConfigs: [{ label: "Max HP", type: "text", max: 99999, for: "teammate" }],
      applyFinalBuff: ({ toSelf, totalAttr, rxnBonus, inputs, desc, tracker }) => {
        const hp = toSelf ? totalAttr.hp : inputs[0] || 0;
        const stacks = Math.floor(Math.min(hp, 50000) / 1000);

        applyModifier(
          desc,
          rxnBonus,
          ["burning.pct", "bloom.pct", "hyperbloom.pct", "burgeon.pct"],
          stacks * 2,
          tracker
        );
        applyModifier(desc, rxnBonus, ["aggravate.pct", "spread.pct"], stacks * 0.8, tracker);
      },
    },
    {
      index: 2,
      src: EModSrc.C4,
      affect: EModAffect.PARTY,
      isGranted: checkCons[4],
      desc: () => Baizhu.constellation[3].desc,
      applyBuff: makeModApplier("totalAttr", "em", 80),
    },
  ],
};

export default Baizhu;
