import type { DataCharacter } from "@Src/types";
import { Green, Rose } from "@Src/pure-components";
import { EModAffect } from "@Src/constants";
import { EModSrc, HEAVY_PAs } from "../constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { checkAscs, checkCons } from "../utils";

const Freminet: DataCharacter = {
  code: 4,
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
  isReverseXtraLv: true,
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
        { name: "Frost DMG", multFactors: 3.58 },
        { name: "Level 0 Shattering Pressure", multFactors: 200.48 },
        {
          name: "Level 1 Shattering Pressure",
          multFactors: [{ root: 100.24 }, { root: 45.82 }],
        },
        {
          name: "Level 2 Shattering Pressure",
          multFactors: [{ root: 70.17 }, { root: 80.19 }],
        },
        {
          name: "Level 3 Shattering Pressure",
          multFactors: [{ root: 40.1 }, { root: 114.56 }],
        },
        { name: "Level 4 Shattering Pressure", multFactors: 229.12, attElmt: "phys" },

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
          When Freminet triggers Shatter against opponents, the dealt by <Green>Shattering Pressure DMG</Green> [~ES]
          will be increased by <Green>40%</Green> for 5s.
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
  buffs: [
    {
      index: 1,
      src: EModSrc.A4,
      affect: EModAffect.SELF,
      desc: () => Freminet.passiveTalents[1].desc,
      isGranted: checkAscs[4],
    },
    {
      index: 2,
      src: EModSrc.C6,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          Spirit Blade: Cloud-Parting Star <Green>[EB]</Green> deals <Green b>15%</Green> <Green>more DMG</Green> to
          opponents with a lower percentage of their Max HP remaining than Freminet.
        </>
      ),
      isGranted: checkCons[6],
      applyBuff: makeModApplier("attPattBonus", "EB.pct_", 15),
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.A4,
      desc: () => (
        <>
          When the field created by Spirit Blade: Chonghua's Layered Frost [ES] disappears, another spirit blade will be
          summoned to strike nearby opponents and decrease their <Green>Cryo RES</Green> by <Green b>10%</Green> for 8s.
        </>
      ),
      isGranted: checkAscs[4],
      applyDebuff: makeModApplier("resistReduct", "cryo", 10),
    },
  ],
};

export default Freminet;
