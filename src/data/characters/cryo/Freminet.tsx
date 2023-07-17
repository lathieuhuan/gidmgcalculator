import type { DataCharacter, GetTalentBuffFn } from "@Src/types";
import { Green, Rose } from "@Src/pure-components";
import { EModAffect } from "@Src/constants";
import { EModSrc, HEAVY_PAs } from "../constants";
import { applyModifier } from "@Src/utils/calculation";
import { charModIsInUse, checkAscs, checkCons, talentBuff } from "../utils";

const getShatteringPressureBuff: GetTalentBuffFn = ({ selfBuffCtrls, char }) => {
  const A4isInUse = charModIsInUse(Freminet.buffs!, char, selfBuffCtrls, 1);
  return talentBuff([A4isInUse, "pct_", [true, 4], 40], [checkCons[1](char), "cRate_", [false, 1], 15]);
};

const Freminet: DataCharacter = {
  code: 74,
  name: "Freminet",
  icon: "https://images2.imgbox.com/fa/bf/A2tmjH1a_o.png",
  sideIcon: "",
  rarity: 4,
  nation: "fontaine",
  vision: "cryo",
  weaponType: "claymore",
  stats: [
    [1012, 21, 59],
    [2600, 55, 153],
    [3356, 71, 197],
    [5027, 106, 295],
    [5564, 117, 327],
    [6400, 135, 376],
    [7117, 150, 418],
    [7953, 168, 467],
    [8490, 179, 498],
    [9325, 197, 547],
    [9862, 208, 579],
    [10698, 226, 628],
    [11235, 237, 659],
    [12071, 255, 708],
  ],
  bonusStat: { type: "atk_", value: 6 },
  NAsConfig: {
    name: "Flowing Eddies",
  },
  bonusLvFromCons: ["NAs", "ES"],
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: 84.24 },
        { name: "2-Hit", multFactors: 80.68 },
        { name: "3-Hit", multFactors: 101.9 },
        { name: "4-Hit", multFactors: 123.8 },
      ],
    },
    CA: {
      stats: [
        { name: "Charged Attack Cyclic", multFactors: 62.52 },
        { name: "Charged Attack Final", multFactors: 113.09 },
      ],
    },
    PA: { stats: HEAVY_PAs },
    ES: {
      name: "Pressurized Floe",
      image: "",
      stats: [
        { name: "Upward Thrust", multFactors: 83.04 },
        {
          name: "Frost DMG",
          multFactors: 7.2,
          getTalentBuff: ({ char, selfBuffCtrls }) => {
            const isInUse = charModIsInUse(Freminet.buffs!, char, selfBuffCtrls, 0);
            return talentBuff([isInUse, "multPlus", "Stalking mode", 100]);
          },
        },
        {
          name: "Level 0 Shattering Pressure",
          multFactors: 200.48,
          getTalentBuff: getShatteringPressureBuff,
        },
        {
          name: "Level 1 Shattering Pressure (cryo)",
          multFactors: 100.24,
          getTalentBuff: getShatteringPressureBuff,
        },
        {
          name: "Level 1 Shattering Pressure (physical)",
          multFactors: 48.7,
          attElmt: "phys",
          getTalentBuff: getShatteringPressureBuff,
        },
        {
          name: "Level 2 Shattering Pressure (cryo)",
          multFactors: 70.17,
          getTalentBuff: getShatteringPressureBuff,
        },
        {
          name: "Level 2 Shattering Pressure (physical)",
          multFactors: 85.2,
          attElmt: "phys",
          getTalentBuff: getShatteringPressureBuff,
        },
        {
          name: "Level 3 Shattering Pressure (cryo)",
          multFactors: 40.1,
          getTalentBuff: getShatteringPressureBuff,
        },
        {
          name: "Level 3 Shattering Pressure (physical)",
          multFactors: 121.7,
          attElmt: "phys",
          getTalentBuff: getShatteringPressureBuff,
        },
        {
          name: "Level 4 Shattering Pressure",
          multFactors: 243.4,
          attElmt: "phys",
          getTalentBuff: getShatteringPressureBuff,
        },
        { name: "Spiritbreath Thorn", multFactors: 14.4 },
      ],
    },
    EB: {
      name: "Shadowhunter's Ambush",
      image: "",
      stats: [{ name: "Skill DMG", multFactors: 318.4 }],
      energyCost: 60,
    },
  },
  passiveTalents: [
    {
      name: "Saturation Deep Dive",
      image: "",
      desc: (
        <>
          When using Shattering Pressure [~ES], if Pers Time has less than 4 levels of Pressure, the CD of Pressurized
          Floe will be decreased by 1s.
        </>
      ),
    },
    {
      name: "Parallel Condensers",
      image: "",
      desc: (
        <>
          When Freminet triggers Shatter against opponents, <Green>Shattering Pressure DMG</Green> [~ES] will be
          increased by <Green>40%</Green> for 5s.
        </>
      ),
    },
    { name: "Deepwater Navigation", image: "" },
  ],
  constellation: [
    {
      name: "Dreams of the Seething Deep",
      image: "",
      desc: (
        <>
          The <Green>CRIT Rate of Shattering Pressure</Green> will be increased by <Green b>15%</Green>.
        </>
      ),
    },
    {
      name: "Penguins and the Land of Plenty",
      image: "",
      desc: (
        <>
          Unleashing Pressurized Floe: Shattering Pressure will restore 2 Energy to Freminet. If a Pressure Level 4
          Shattering Pressure is unleashed, this will restore 3 Energy.
        </>
      ),
    },
    { name: "Song of the Eddies and Bleached Sands", image: "" },
    {
      name: "Dance of the Snowy Moon and Flute",
      image: "",
      desc: (
        <>
          When Freminet triggers Frozen, Shatter, or Superconduct against opponents, his <Green>ATK</Green> will be
          increased by <Green b>9%</Green> for 6s. Max <Rose>2</Rose> stacks. This can be triggered once every 0.3s.
        </>
      ),
    },
    { name: "Nights of Hearth and Happiness", image: "" },
    {
      name: "Moment of Waking and Resolve",
      image: "",
      desc: (
        <>
          When Freminet triggers Frozen, Shatter, or Superconduct against opponents, his <Green>CRIT DMG</Green> will be
          increased by <Green b>12%</Green> for 6s. Max <Rose>3</Rose> stacks. This can be triggered once every 0.3s.
        </>
      ),
    },
  ],
  innateBuffs: [
    {
      src: EModSrc.C1,
      desc: () => Freminet.constellation[0].desc,
      isGranted: checkCons[1],
    },
  ],
  buffs: [
    {
      index: 0,
      src: "Stalking mode",
      affect: EModAffect.SELF,
      desc: () => (
        <>
          While in Stalking mode, <Green>Frost</Green> released by his Normal Attacks deal <Green b>200%</Green> of
          their original DMG.
        </>
      ),
    },
    {
      index: 1,
      src: EModSrc.A4,
      affect: EModAffect.SELF,
      desc: () => Freminet.passiveTalents[1].desc,
      isGranted: checkAscs[4],
    },
    {
      index: 2,
      src: EModSrc.C4,
      affect: EModAffect.SELF,
      desc: () => Freminet.constellation[3].desc,
      isGranted: checkCons[4],
      inputConfigs: [
        {
          type: "stacks",
          max: 2,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        const buffValue = 9 * (inputs[0] || 0);
        applyModifier(desc, totalAttr, "atk_", buffValue, tracker);
      },
    },
    {
      index: 3,
      src: EModSrc.C6,
      affect: EModAffect.SELF,
      desc: () => Freminet.constellation[5].desc,
      isGranted: checkCons[6],
      inputConfigs: [
        {
          type: "stacks",
          max: 3,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        const buffValue = 12 * (inputs[0] || 0);
        applyModifier(desc, totalAttr, "cDmg_", buffValue, tracker);
      },
    },
  ],
};

export default Freminet;
