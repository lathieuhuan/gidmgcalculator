import type { DataCharacter } from "@Src/types";
import { Green } from "@Src/pure-components";
import { EModAffect } from "@Src/constants";
import { EModSrc, HEAVY_PAs } from "../constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { checkAscs, checkCons } from "../utils";

const Chongyun: DataCharacter = {
  code: 4,
  name: "Chongyun",
  icon: "3/35/Chongyun_Icon",
  sideIcon: "2/20/Chongyun_Side_Icon",
  rarity: 4,
  nation: "liyue",
  vision: "cryo",
  weaponType: "claymore",
  stats: [
    [921, 19, 54],
    [2366, 48, 140],
    [3054, 62, 180],
    [4574, 93, 270],
    [5063, 103, 299],
    [5824, 119, 344],
    [6475, 131, 382],
    [7236, 147, 427],
    [7725, 157, 456],
    [8485, 172, 501],
    [8974, 182, 530],
    [9734, 198, 575],
    [10223, 208, 603],
    [10874, 223, 648],
  ],
  bonusStat: { type: "atk_", value: 6 },
  NAsConfig: {
    name: "Demonbane",
  },
  isReverseXtraLv: true,
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: 70 },
        { name: "2-Hit", multFactors: 63.12 },
        { name: "3-Hit", multFactors: 80.32 },
        { name: "4-Hit", multFactors: 101.22 },
        {
          name: "Ice blade (1/3) (C1)",
          multFactors: { root: 50, scale: 0 },
          attElmt: "cryo",
          attPatt: "none",
        },
      ],
    },
    CA: {
      stats: [
        { name: "Charged Attack Spinning", multFactors: 56.29 },
        { name: "Charged Attack Final", multFactors: 101.78 },
      ],
    },
    PA: { stats: HEAVY_PAs },
    ES: {
      name: "Spirit Blade: Chonghua's Layered Frost",
      image: "a/aa/Talent_Spirit_Blade_Chonghua%27s_Layered_Frost",
      stats: [{ name: "Skill DMG", multFactors: 172.04 }],
      // getExtraStats: (lv) => [
      //   { name: "Infusion Duration", value: Math.min(19 + lv, 30) / 10 + "s" },
      //   { name: "Field Duration", value: "10s" },
      //   { name: "CD", value: "15s" },
      // ],
    },
    EB: {
      name: "Spirit Blade: Cloud-Parting Star",
      image: "9/93/Talent_Spirit_Blade_Cloud-Parting_Star",
      stats: [{ name: "Blade DMG", multFactors: 142.4 }],
      // getExtraStats: () => [{ name: "CD", value: "12s" }],
      energyCost: 40,
    },
  },
  passiveTalents: [
    { name: "Steady Breathing", image: "4/49/Talent_Steady_Breathing" },
    { name: "Rimechaser Blade", image: "1/12/Talent_Rimechaser_Blade" },
    { name: "Gallant Journey", image: "c/c4/Talent_Gallant_Journey" },
  ],
  constellation: [
    { name: "Ice Unleashed", image: "d/db/Constellation_Ice_Unleashed" },
    { name: "Atmospheric Revolution", image: "8/8f/Constellation_Atmospheric_Revolution" },
    { name: "Cloudburst", image: "b/b6/Constellation_Cloudburst" },
    { name: "Frozen Skies", image: "9/99/Constellation_Frozen_Skies" },
    { name: "The True Path", image: "3/33/Constellation_The_True_Path" },
    { name: "Rally of Four Blades", image: "1/18/Constellation_Rally_of_Four_Blades" },
  ],
  buffs: [
    {
      index: 1,
      src: EModSrc.A1,
      affect: EModAffect.ACTIVE_UNIT,
      desc: () => (
        <>
          Sword, Claymore, or Polearm-wielding characters within Spirit Blade: Chonghua's Layered Frost [ES] field have
          their <Green>Normal ATK SPD</Green> increased by <Green b>8%</Green>.
        </>
      ),
      isGranted: checkAscs[1],
      applyBuff: ({ totalAttr, charData, desc, tracker }) => {
        if (["sword", "claymore", "polearm"].includes(charData.weaponType))
          applyModifier(desc, totalAttr, "naAtkSpd_", 8, tracker);
      },
    },
    {
      index: 2,
      src: EModSrc.C6,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          Spirit Blade: Cloud-Parting Star <Green>[EB]</Green> deals <Green b>15%</Green> <Green>more DMG</Green> to
          opponents with a lower percentage of their Max HP remaining than Chongyun.
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

export default Chongyun;
