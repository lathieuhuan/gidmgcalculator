import type { DataCharacter } from "@Src/types";
import { Green, Rose } from "@Src/pure-components";
import { EModAffect } from "@Src/constants";
import { EModSrc, HEAVY_PAs } from "../constants";
import { applyPercent } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { charModIsInUse, checkCons, talentBuff } from "../utils";

const Dehya: DataCharacter = {
  code: 68,
  name: "Dehya",
  icon: "3/3f/Dehya_Icon",
  sideIcon: "a/af/Dehya_Side_Icon",
  rarity: 5,
  nation: "sumeru",
  vision: "pyro",
  weaponType: "claymore",
  stats: [
    [1220, 21, 49],
    [3165, 54, 127],
    [4212, 71, 169],
    [6302, 107, 252],
    [7045, 119, 282],
    [8106, 137, 324],
    [9097, 154, 364],
    [10168, 172, 407],
    [10912, 185, 437],
    [11993, 203, 480],
    [12736, 216, 510],
    [13829, 234, 554],
    [14573, 247, 584],
    [15675, 265, 628],
  ],
  bonusStat: { type: "hp_", value: 7.2 },
  NAsConfig: {
    name: "Sandstorm Assault",
  },
  bonusLvFromCons: ["EB", "ES"],
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: 62.12 },
        { name: "2-Hit", multFactors: 61.71 },
        { name: "3-Hit", multFactors: 76.63 },
        { name: "4-Hit", multFactors: 95.29 },
      ],
    },
    CA: {
      stats: [
        { name: "Charged Attack Spinning", multFactors: 56.33 },
        { name: "Charged Attack Final", multFactors: 101.82 },
      ],
    },
    PA: { stats: HEAVY_PAs },
    ES: {
      name: "Molten Inferno",
      image: "6/6b/Talent_Molten_Inferno",
      stats: [
        { name: "Indomitable Flame", multFactors: 112.88 },
        { name: "Ranging Flame", multFactors: 132.8 },
        {
          name: "Field DMG",
          multFactors: [
            {
              root: 60.2,
            },
            {
              root: 1.03,
              attributeType: "hp",
            },
          ],
          isWholeFactor: true,
          getTalentBuff: ({ char, selfBuffCtrls }) => {
            const C2isInUse = charModIsInUse(Dehya.buffs || [], char, selfBuffCtrls, 0);
            return talentBuff([C2isInUse, "pct_", [false, 2], 50]);
          },
        },
      ],
    },
    EB: {
      name: "The Lioness's Bite",
      image: "1/12/Talent_Leonine_Bite",
      stats: [
        {
          name: "Flame-Mane's Fist",
          multFactors: [{ root: 98.7 }, { root: 1.69, attributeType: "hp" }],
          isWholeFactor: true,
        },
        {
          name: "Incineration Drive",
          multFactors: [{ root: 139.3 }, { root: 2.39, attributeType: "hp" }],
          isWholeFactor: true,
        },
      ],
      energyCost: 70,
    },
  },
  passiveTalents: [
    { name: "Unstinting Succor", image: "4/47/Talent_Unstinting_Succor" },
    { name: "Stalwart and True", image: "1/12/Talent_Stalwart_and_True" },
    { name: "The Sunlit Way", image: "e/ee/Talent_The_Sunlit_Way" },
  ],
  constellation: [
    {
      name: "The Flame Incandescent",
      image: "5/50/Constellation_The_Flame_Incandescent",
      desc: (
        <>
          Dehya's <Green>Max HP</Green> is increased by <Green>20%</Green>, and:
          <br />• Molten Inferno's <Green>[ES] DMG</Green> will be increased by <Green b>3.6%</Green> of her{" "}
          <Green>Max HP</Green>.
          <br />• The Lioness's Bite's <Green>[EB] DMG</Green> will be increased by <Green b>6%</Green> of her{" "}
          <Green>Max HP</Green>.
        </>
      ),
    },
    {
      name: "The Sand-Blades Glittering",
      image: "0/08/Constellation_The_Sand-Blades_Glittering",
      get desc() {
        return (
          <>
            When Dehya uses Molten Inferno: Ranging Flame [ES], the duration of the recreated Fiery Sanctum field will
            be increased by 4s. {this.xtraDesc?.[0]}
          </>
        );
      },
      xtraDesc: [
        <>
          When a <Green>Fiery Sanctum</Green> exists on the field, <Green>DMG</Green> dealt by its next coordinated
          attack will be increased by <Green b>50%</Green> when active character(s) within the Fiery Sanctum field are
          attacked.
        </>,
      ],
    },
    { name: "A Rage Swift as Fire", image: "e/ee/Constellation_A_Rage_Swift_as_Fire" },
    {
      name: "An Oath Abiding",
      image: "3/31/Constellation_An_Oath_Abiding",
      desc: (
        <>
          When Lioness's Bite attacks hit opponents, they will restore 1.5 Energy for Dehya and 2.5% of her Max HP. This
          effect can be triggered once every 0.2s.
        </>
      ),
    },
    { name: "The Alpha Unleashed", image: "3/38/Constellation_The_Alpha_Unleashed" },
    {
      name: "The Burning Claws Cleaving",
      image: "2/26/Constellation_The_Burning_Claws_Cleaving",
      get desc() {
        return (
          <>
            {this.xtraDesc?.[0]} and extend that duration by 0.5s. This effect can trigger every 0.2s. The duration can
            be extended for a maximum of 2s, and CRIT DMG can be increased by a maximum of 60% this way.
          </>
        );
      },
      xtraDesc: [
        <>
          The <Green>CRIT Rate</Green> of The Lioness's Bite [EB] is increased by <Green b>10%</Green>. After a
          Flame-Mane's Fist attack hits an opponent and deals CRIT hits, it will cause the <Green>CRIT DMG</Green> of
          The Lioness's Bite to increase by <Green b>15%</Green> for the rest of Blazing Lioness's duration
        </>,
      ],
    },
  ],
  innateBuffs: [
    {
      src: EModSrc.C1,
      isGranted: checkCons[1],
      desc: () => Dehya.constellation[0].desc,
      applyBuff: makeModApplier("totalAttr", "hp_", 20),
      applyFinalBuff: ({ totalAttr, attPattBonus, tracker, desc }) => {
        const buffs = [3.6, 6].map((mult) => ({
          value: applyPercent(totalAttr.hp, mult),
          desc: desc + ` / ${mult}% of ${Math.round(totalAttr.hp)} HP`,
        }));

        applyModifier(buffs[0].desc, attPattBonus, "ES.flat", buffs[0].value, tracker);
        applyModifier(buffs[1].desc, attPattBonus, "EB.flat", buffs[1].value, tracker);
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      isGranted: checkCons[2],
      desc: () => Dehya.constellation[1].xtraDesc?.[0],
    },
    {
      index: 1,
      src: EModSrc.C6,
      affect: EModAffect.SELF,
      isGranted: checkCons[6],
      desc: () => (
        <>
          {Dehya.constellation[5].xtraDesc?.[0]}. Max <Rose>60%</Rose>.
        </>
      ),
      inputConfigs: [
        {
          type: "stacks",
          initialValue: 0,
          max: 4,
        },
      ],
      applyBuff: ({ attPattBonus, inputs, desc, tracker }) => {
        const buffValue = (inputs[0] || 0) * 15;
        applyModifier(desc, attPattBonus, ["EB.cRate_", "EB.cDmg_"], [10, buffValue], tracker);
      },
    },
  ],
};

export default Dehya;
