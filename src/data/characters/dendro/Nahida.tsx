import type { CharInfo, DataCharacter, PartyData } from "@Src/types";
import { Green } from "@Src/styled-components";
import { EModAffect } from "@Src/constants";
import { EModSrc, LIGHT_PAs, TALENT_LV_MULTIPLIERS } from "../constants";
import { round2, round3 } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Calculators/utils";
import { checkAscs, checkCons, modIsActivated, talentBuff } from "../utils";

function getEBBuffValue(char: CharInfo, partyData: PartyData) {
  const pyroCount = partyData.reduce(
    (result, data) => (data.vision === "pyro" ? result + 1 : result),
    checkCons[1](char) ? 1 : 0
  );
  const multBase = pyroCount === 1 ? 14.88 : pyroCount >= 2 ? 22.32 : 0;
  return [round2(multBase * TALENT_LV_MULTIPLIERS[2][char.EB]), pyroCount];
}

const Nahida: DataCharacter = {
  code: 62,
  name: "Nahida",
  icon: "c/cf/Character_Nahida_Thumb",
  sideIcon: "1/13/Character_Nahida_Side_Icon",
  rarity: 5,
  nation: "sumeru",
  vision: "dendro",
  weapon: "catalyst",
  stats: [
    [807, 23, 49],
    [2092, 60, 127],
    [2784, 80, 169],
    [4165, 120, 253],
    [4656, 134, 283],
    [5357, 157, 326],
    [6012, 174, 366],
    [6721, 194, 409],
    [7212, 208, 439],
    [7926, 229, 482],
    [8418, 243, 512],
    [9140, 264, 556],
    [9632, 278, 586],
    [10360, 299, 640],
  ],
  bonusStat: { type: "em", value: 28.8 },
  NAsConfig: {
    name: "Form",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multBase: 40.3 },
        { name: "2-Hit", multBase: 36.97 },
        { name: "3-Hit", multBase: 45.87 },
        { name: "4-Hit", multBase: 58.21 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack", multBase: 132 }] },
    PA: { stats: LIGHT_PAs },
    ES: {
      name: "All Schemes to Know",
      image: "7/72/Talent_All_Schemes_to_Know",
      xtraLvAtCons: 3,
      stats: [
        { name: "Press DMG", multBase: 98.4 },
        { name: "Hold DMG", multBase: 130.4 },
        {
          name: "Tri-Karma Purification DMG",
          multBase: 103.2,
          getTalentBuff: ({ totalAttr, char, partyData, selfBuffCtrls }) => {
            let buffValue = 0;
            let desc = [];
            const EBBuffIsActivated = modIsActivated(selfBuffCtrls, 0);
            const A4BuffIsActivated = checkAscs[4](char);
            const excessEM = Math.max(totalAttr.em - 200, 0);

            if (EBBuffIsActivated) {
              const [EBBuffValue] = getEBBuffValue(char, partyData);
              if (EBBuffValue) {
                buffValue += EBBuffValue;
                desc.push(`Elemental Burst (${EBBuffValue})`);
              }
            }
            if (A4BuffIsActivated) {
              const A4BuffValue = Math.min(excessEM / 10, 80);
              if (A4BuffValue) {
                buffValue += A4BuffValue;
                desc.push(`A4 Passive Talent (${A4BuffValue})`);
              }
            }
            const emPartMult = 206.4 * TALENT_LV_MULTIPLIERS[2][char.ES];
            const emPart = Math.round((emPartMult / 100) * totalAttr.em);

            return talentBuff(
              [
                true,
                "flat",
                `Elemental Mastery Part (Elemental Mastery ${totalAttr.em} * Talent Mult. ${round3(
                  emPartMult
                )}%)`,
                emPart,
              ],
              [EBBuffIsActivated || A4BuffIsActivated, "pct", desc.join(" + "), buffValue],
              [A4BuffIsActivated, "cRate", [true, 4], Math.min(excessEM * 0.03, 24)]
            );
          },
        },
        {
          name: "Karmic Oblivion DMG (C6)",
          isStatic: true,
          multBase: 200,
          getTalentBuff: ({ totalAttr, char }) => {
            const emPartDesc = `Elemental Mastery Part (Elemental Mastery ${totalAttr.em} * Mult. 400%)`;
            return talentBuff([checkCons[6](char), "flat", emPartDesc, totalAttr.em * 4]);
          },
        },
      ],
      // getExtraStats: () => [
      //   { name: "Tri-Karma Purification Trigger Interval", value: "1.9s" },
      //   { name: "Seed of Skandha Duration", value: "20s" },
      //   { name: "CD (Press)", value: "5s" },
      //   { name: "CD (Hold)", value: "6s" },
      // ],
    },
    EB: {
      name: "Illusory Heart",
      image: "e/e9/Talent_Illusory_Heart",
      xtraLvAtCons: 5,
      stats: [],
      // getExtraStats: (lv) => [
      //   {
      //     name: "Pyro: DMG Bonus",
      //     value: `1 Character ${round2(
      //       11.12 * TALENT_LV_MULTIPLIERS[2][lv]
      //     )}% / 2 Characters ${round2(16.72 * TALENT_LV_MULTIPLIERS[2][lv])}%`,
      //   },
      //   {
      //     name: "Electro: CD Decrease",
      //     value: `1 Character ${1}s / 2 Characters ${2}s`,
      //   },
      //   {
      //     name: "Hydro: Duration Extension",
      //     value: `1 Character ${1}s / 2 Characters ${2}s`,
      //   },
      //   { name: "Base Duration", value: "15s" },
      //   { name: "CD", value: "13.5s" },
      // ],
      energyCost: 50,
    },
  },
  passiveTalents: [
    { name: "Compassion Illuminated", image: "6/63/Talent_Compassion_Illuminated" },
    { name: "Awakening Elucidated", image: "1/1a/Talent_Awakening_Elucidated" },
    { name: "On All Things Meditated", image: "d/db/Talent_On_All_Things_Meditated" },
  ],
  constellation: [
    {
      name: "The Seed of Stored Knowledge",
      image: "5/5f/Constellation_The_Seed_of_Stored_Knowledge",
      desc: (
        <>
          When the Shrine of Maya is unleashed and the Elemental Types of the party members are
          being tabulated, the count will add <Green b>1</Green> to the{" "}
          <Green>number of Pyro, Electro, and Hydro characters</Green> respectively.
        </>
      ),
    },
    {
      name: "The Root of All Fullness",
      image: "3/38/Constellation_The_Root_of_All_Fullness",
      get desc() {
        return (
          <>
            Opponents that are marked by Nahida's own Seed of Skandha will be affected by the
            following effects:
            <br />• {this.xtraDesc![0]}
            <br />• {this.xtraDesc![1]}
          </>
        );
      },
      xtraDesc: [
        <>
          <Green>Burning, Bloom, Hyperbloom, Burgeon Reaction DMG</Green> can score CRIT Hits.{" "}
          <Green>CRIT Rate</Green> and <Green>CRIT DMG</Green> are fixed at <Green b>20%</Green> and{" "}
          <Green b>100%</Green> respectively.
        </>,
        <>
          Within 8s of being affected by Quicken, Aggravate, Spread, <Green>DEF</Green> is decreased
          by <Green b>30%</Green>.
        </>,
      ],
    },
    {
      name: "The Shoot of Conscious Attainment",
      image: "1/18/Constellation_The_Shoot_of_Conscious_Attainment",
    },
    {
      name: "The Stem of Manifest Inference",
      image: "8/8b/Constellation_The_Stem_of_Manifest_Inference",
      desc: (
        <>
          When 1/2/3/(4 or more) nearby opponents are affected by All Schemes to Know's Seeds of
          Skandha, Nahida's <Green>Elemental Mastery</Green> will be increased by{" "}
          <Green b>100/120/140/160</Green>.
        </>
      ),
    },
    {
      name: "The Leaves of Enlightening Speech",
      image: "f/fb/Constellation_The_Leaves_of_Enlightening_Speech",
    },
    {
      name: "The Fruit of Reason's Culmination",
      image: "b/b5/Constellation_The_Fruit_of_Reason%27s_Culmination",
      desc: (
        <>
          When Nahida hits an opponent linked by All Schemes to Know's Seeds of Skandha with Normal
          or Charged Attacks after unleashing Illusory Heart, she will use Karmic Oblivion on this
          opponent and all connected opponents, dealing Dendro DMG based on 200% of Nahida's ATK and
          400% of her Elemental Mastery.
          <br />
          DMG dealt by Karmic Oblivion is considered Elemental Skill DMG and can be triggered once
          every 0.2s.
          <br />
          This effect can last up to 10s and will be removed after Nahida has unleashed 6 instances
          of Karmic Oblivion.
        </>
      ),
    },
  ],
  innateBuffs: [
    {
      src: EModSrc.A4,
      desc: () => (
        <>
          Each point of Nahida's Elemental Mastery beyond 200 will grant <Green b>0.1%</Green>{" "}
          <Green>Bonus DMG</Green> and <Green b>0.03%</Green> <Green>CRIT Rate</Green> to{" "}
          <Green>Tri-Karma Purification</Green>. A maximum of <Green b>80%</Green>{" "}
          <Green>Bonus DMG</Green> and <Green b>24%</Green> <Green>CRIT Rate</Green>.
        </>
      ),
      isGranted: checkAscs[4],
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      desc: ({ char, partyData }) => {
        const [buffValue, pyroCount] = getEBBuffValue(char, partyData);
        return (
          <>
            Within the Shrine of Maya, <Green>Tri-Karma Purification DMG</Green> is increased by{" "}
            <Green b>{buffValue}%</Green> ({pyroCount} Pyro teammates).
          </>
        );
      },
      isGranted: () => true,
      affect: EModAffect.SELF,
    },
    {
      index: 1,
      src: EModSrc.A1,
      desc: () => (
        <>
          The Elemental Mastery of the active character within the Shrine of Maya will be increased
          by <Green>25%</Green> of the <Green>Elemental Mastery</Green> of the party member with the
          highest Elemental Mastery. Max <Green>250</Green> <Green>Elemental Mastery</Green>.
        </>
      ),
      isGranted: checkAscs[1],
      affect: EModAffect.ACTIVE_UNIT,
      inputConfigs: [
        {
          label: "Highest Elemental Mastery",
          type: "text",
          max: 9999,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        applyModifier(desc, totalAttr, "em", Math.min((inputs?.[0] || 0) * 0.25, 250), tracker);
      },
    },
    {
      index: 3,
      src: EModSrc.C2,
      desc: () => Nahida.constellation[1].xtraDesc![0],
      isGranted: checkCons[2],
      affect: EModAffect.PARTY,
    },
    {
      index: 4,
      src: EModSrc.C4,
      desc: () => Nahida.constellation[3].desc,
      isGranted: checkCons[4],
      affect: EModAffect.SELF,
      inputConfigs: [
        {
          label: "Number of the affected",
          type: "select",
          max: 4,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        applyModifier(desc, totalAttr, "em", (inputs?.[0] || 0) * 20 + 80, tracker);
      },
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C2,
      desc: () => Nahida.constellation[1].xtraDesc![1],
      isGranted: checkCons[2],
      affect: EModAffect.PARTY,
      applyDebuff: makeModApplier("resistReduct", "def", 30),
    },
  ],
};

export default Nahida;
