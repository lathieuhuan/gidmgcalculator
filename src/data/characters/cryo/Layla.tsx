import type { DataCharacter } from "@Src/types";
import { Green, Rose } from "@Components/atoms";
import { EModAffect } from "@Src/constants";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { applyPercent } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { checkAscs, checkCons, talentBuff } from "../utils";

const Layla: DataCharacter = {
  code: 61,
  name: "Layla",
  icon: "1/1a/Layla_Icon",
  sideIcon: "2/23/Layla_Side_Icon",
  rarity: 4,
  nation: "sumeru",
  vision: "cryo",
  weaponType: "sword",
  stats: [
    [930, 18, 55],
    [2389, 47, 141],
    [3084, 60, 182],
    [4619, 90, 273],
    [5113, 100, 302],
    [5881, 115, 347],
    [6540, 128, 386],
    [7308, 143, 432],
    [7801, 152, 461],
    [8569, 167, 506],
    [9062, 177, 535],
    [9831, 192, 581],
    [10324, 202, 610],
    [11092, 217, 655],
  ],
  bonusStat: { type: "hp_", value: 6 },
  NAsConfig: {
    name: "Sword of the Radiant Path",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: 51.22 },
        { name: "2-Hit", multFactors: 48.48 },
        { name: "3-Hit", multFactors: 72.97 },
      ],
    },
    CA: {
      stats: [{ name: "Charged Attack DMG", multFactors: [47.73, 52.55] }],
    },
    PA: { stats: MEDIUM_PAs },
    ES: {
      name: "Nights of Formal Focus",
      image: "9/90/Talent_Nights_of_Formal_Focus",
      stats: [
        { name: "Skill DMG", multFactors: 12.8 },
        {
          name: "Shooting Star DMG",
          multFactors: 14.72,
          getTalentBuff: ({ char, totalAttr }) => {
            return talentBuff(
              [checkAscs[4](char), "flat", [true, 4], applyPercent(totalAttr.hp, 1.5)],
              [checkCons[6](char), "pct_", [false, 6], 40]
            );
          },
        },
        {
          name: "Base Shield DMG Absorption",
          notAttack: "shield",
          multFactors: { root: 10.8, attributeType: "hp" },
          flatFactor: 1040,
          getTalentBuff: ({ char }) => talentBuff([checkCons[1](char), "pct_", [false, 1], 20]),
        },
      ],
      // getExtraStats: (lv) => [{ name: "Shield Duration", value: "12s" }],
    },
    EB: {
      name: "Dream of the Star-Stream Shaker",
      image: "b/b4/Talent_Dream_of_the_Star-Stream_Shaker",
      stats: [{ name: "Starlight Slug DMG", multFactors: { root: 4.65, attributeType: "hp" } }],
      // getExtraStats: () => [
      //   { name: "Duration", value: "12s" },
      //   { name: "CD", value: "15s" },
      // ],
      energyCost: 40,
    },
  },
  passiveTalents: [
    {
      name: "Like Nascent Light",
      image: "6/6d/Talent_Like_Nascent_Light",
      desc: (
        <>
          While the Curtain of Slumber [~ES] is active, each time the Curtain gains a Night Star:
          <br />• The <Green>Shield Strength</Green> of the character is increased by <Green b>6%</Green>. Max{" "}
          <Rose>4</Rose> stacks.
          <br />• This effect persists until the Curtain of Slumber disappears.
        </>
      ),
    },
    {
      name: "Sweet Slumber Undisturbed",
      image: "3/32/Talent_Sweet_Slumber_Undisturbed",
      desc: (
        <>
          <Green>Shooting Star DMG</Green> [~ES] is increased by <Green b>1.5%</Green> of Layla's <Green>Max HP</Green>.
        </>
      ),
    },
    { name: "Shadowy Dream-Signs", image: "5/51/Talent_Shadowy_Dream-Signs" },
  ],
  constellation: [
    {
      name: "Fortress of Fantasy",
      image: "5/50/Constellation_Fortress_of_Fantasy",
      get desc() {
        return (
          <>
            {this.xtraDesc![0]}
            <br />
            Additionally, when unleashing Nights of Formal Focus [ES], she will generate a shield for any nearby party
            members who are not being protected by a Curtain of Slumber. This shield will have 35% of the absorption of
            a Curtain of Slumber, will last for 12s, and will absorb Cryo DMG with 250% effectiveness.
          </>
        );
      },
      xtraDesc: [
        <>
          The <Green>Shield Absorption</Green> of the Curtain of Slumber [~ES] is increased by <Green b>20%</Green>.
        </>,
      ],
    },
    {
      name: "Light's Remit",
      image: "6/6a/Constellation_Light%27s_Remit",
      desc: (
        <>
          When Shooting Stars [~ES] strike opponents, they will each restore <Green>1</Green> <Green>Energy</Green> to
          Layla. Each Shooting Star can restore Energy to her in this manner once.
        </>
      ),
    },
    { name: "Secrets of the Night", image: "6/66/Constellation_Secrets_of_the_Night" },
    {
      name: "Starry Illumination",
      image: "a/ab/Constellation_Starry_Illumination",
      get desc() {
        return (
          <>
            {this.xtraDesc![0]}
            <br />
            Open Mind can last up to 3s and will be removed 0.1s after dealing Normal or Charged Attack DMG.
          </>
        );
      },
      xtraDesc: [
        <>
          When Nights of Formal Focus [ES] starts to fire off Shooting Stars, it will increases{" "}
          <Green>Normal and Charged Attack DMG</Green> of nearby party members based on <Green b>5%</Green> of Layla's{" "}
          <Green>Max HP</Green>.
        </>,
      ],
    },
    { name: "Stream of Consciousness", image: "8/8f/Constellation_Stream_of_Consciousness" },
    {
      name: "Radiant Soulfire",
      image: "b/b9/Constellation_Radiant_Soulfire",
      get desc() {
        return (
          <>
            {this.xtraDesc![0]}
            <br />
            Additionally, the interval between the creation of Night Stars via Nights of Formal Focus is decreased by
            20%.
          </>
        );
      },
      xtraDesc: [
        <>
          Increases <Green>Shooting Star DMG</Green> [~ES] and <Green>Starlight Slug DMG</Green> [~EB] by{" "}
          <Green b>40%</Green>.
        </>,
      ],
    },
  ],
  innateBuffs: [
    {
      src: EModSrc.A4,
      desc: () => Layla.passiveTalents[1].desc,
      isGranted: checkAscs[4],
    },
    {
      src: EModSrc.C1,
      desc: () => Layla.constellation[0].xtraDesc![0],
      isGranted: checkCons[1],
    },
    {
      src: EModSrc.C6,
      desc: () => Layla.constellation[5].xtraDesc![0],
      isGranted: checkCons[6],
      applyBuff: makeModApplier("attPattBonus", "EB.pct_", 40),
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.ACTIVE_UNIT,
      desc: () => Layla.passiveTalents[0].desc,
      isGranted: checkAscs[1],
      inputConfigs: [
        {
          type: "stacks",
          max: 4,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        applyModifier(desc, totalAttr, "shieldS_", 6 * (inputs[0] || 0), tracker);
      },
    },
    {
      index: 3,
      src: EModSrc.C4,
      affect: EModAffect.PARTY,
      desc: () => Layla.constellation[3].xtraDesc![0],
      isGranted: checkCons[4],
      inputConfigs: [
        {
          label: "Max HP",
          type: "text",
          max: 99999,
          for: "teammate",
        },
      ],
      applyFinalBuff: ({ toSelf, totalAttr, attPattBonus, inputs, desc, tracker }) => {
        const maxHP = toSelf ? totalAttr.hp : inputs[0] || 0;
        const buffValue = applyPercent(maxHP, 5);
        applyModifier(desc, attPattBonus, ["NA.flat", "CA.flat"], buffValue, tracker);
      },
    },
  ],
};

export default Layla;
