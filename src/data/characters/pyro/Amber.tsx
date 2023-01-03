import type { DataCharacter } from "@Src/types";
import { Green } from "@Components/atoms";
import { EModAffect } from "@Src/constants";
import { BOW_CAs, EModSrc, LIGHT_PAs } from "../constants";
import { makeModApplier } from "@Src/utils/calculation";
import { checkAscs, checkCons } from "../utils";

const Amber: DataCharacter = {
  code: 18,
  name: "Amber",
  icon: "c/c6/Character_Amber_Thumb",
  sideIcon: "4/4f/Character_Amber_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "pyro",
  weaponType: "bow",
  stats: [
    [793, 19, 50],
    [2038, 48, 129],
    [2630, 62, 167],
    [3940, 93, 250],
    [4361, 103, 277],
    [5016, 118, 318],
    [5578, 131, 354],
    [6233, 147, 396],
    [6654, 157, 422],
    [7309, 172, 464],
    [7730, 182, 491],
    [8385, 198, 532],
    [8806, 208, 559],
    [9461, 223, 601],
  ],
  bonusStat: { type: "atk_", value: 6 },
  NAsConfig: {
    name: "Sharpshooter",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: { root: 36.12 } },
        { name: "2-Hit", multFactors: { root: 36.12 } },
        { name: "3-Hit", multFactors: { root: 46.44 } },
        { name: "4-Hit", multFactors: { root: 47.3 } },
        { name: "5-Hit", multFactors: { root: 59.34 } },
      ],
    },
    CA: { stats: BOW_CAs },
    PA: { stats: LIGHT_PAs },
    ES: {
      name: "Explosive Puppet",
      image: "e/e0/Talent_Explosive_Puppet",
      xtraLvAtCons: 5,
      stats: [
        {
          name: "Inherited HP",
          notAttack: "other",
          multFactors: { root: 41.4, attributeType: "hp" },
        },
        { name: "Explosion DMG", multFactors: { root: 123.2 } },
      ],
      // getExtraStats: () => [{ name: "CD", value: "15s" }],
    },
    EB: {
      name: "Fiery Rain",
      image: "6/6c/Talent_Fiery_Rain",
      xtraLvAtCons: 3,
      stats: [
        { name: "Each Wave DMG", multFactors: { root: 28.08 } },
        { name: "Total DMG", multFactors: { root: 505.44 } },
      ],
      // getExtraStats: () => [
      //   { name: "Duration", value: "2s" },
      //   { name: "CD", value: "12s" },
      // ],
      energyCost: 40,
    },
  },
  passiveTalents: [
    { name: "Every Arrow Finds Its Target", image: "5/54/Talent_Every_Arrow_Finds_Its_Target" },
    { name: "Precise Shot", image: "5/51/Talent_Precise_Shot" },
    { name: "Gliding Champion", image: "d/df/Talent_Gliding_Champion" },
  ],
  constellation: [
    { name: "One Arrow to Rule Them All", image: "c/c9/Constellation_One_Arrow_to_Rule_Them_All" },
    { name: "Bunny Triggered", image: "7/75/Constellation_Bunny_Triggered" },
    { name: "It Burns!", image: "9/93/Constellation_It_Burns%21" },
    { name: "It's Not Just Any Doll...", image: "d/d6/Constellation_It%27s_Not_Just_Any_Doll..." },
    { name: "It's Baron Bunny!", image: "9/95/Constellation_It%27s_Baron_Bunny%21" },
    { name: "Wildfire", image: "1/1b/Constellation_Wildfire" },
  ],
  innateBuffs: [
    {
      src: EModSrc.A1,
      desc: () => (
        <>
          Increases Fiery Rain <Green>[EB] CRIT Rate</Green> by <Green b>10%</Green>.
        </>
      ),
      isGranted: checkAscs[1],
      applyBuff: makeModApplier("attPattBonus", "EB.cRate", 10),
    },
  ],
  buffs: [
    {
      index: 1,
      src: EModSrc.A4,
      desc: () => (
        <>
          Aimed Shot hits on weak spots increase <Green>ATK</Green> by <Green b>15%</Green> for 10s.
        </>
      ),
      affect: EModAffect.SELF,
      isGranted: checkAscs[4],
      applyBuff: makeModApplier("totalAttr", "atk_", 15),
    },
    {
      index: 2,
      src: EModSrc.C2,
      desc: () => (
        <>
          Increases Baron Bunny <Green>[ES] DMG</Green> via manual detonation by{" "}
          <Green b>200%</Green>.
        </>
      ),
      affect: EModAffect.SELF,
      isGranted: checkCons[2],
      applyBuff: makeModApplier("attPattBonus", "ES.pct", 200),
    },
    {
      index: 3,
      src: EModSrc.C6,
      desc: () => (
        <>
          Fiery Rain increases all party members' <Green>Movement SPD</Green> and <Green>ATK</Green>{" "}
          by <Green b>15%</Green> for 10s.
        </>
      ),
      affect: EModAffect.PARTY,
      isGranted: checkCons[6],
      applyBuff: makeModApplier("totalAttr", "atk_", 15),
    },
  ],
};

export default Amber;
