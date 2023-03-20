import type { DataCharacter } from "@Src/types";
import { Green } from "@Components/atoms";
import { EModAffect } from "@Src/constants";
import { BOW_CAs, EModSrc, LIGHT_PAs } from "../constants";
import { makeModApplier } from "@Src/utils/calculation";
import { checkAscs, checkCons } from "../utils";

const Amber: DataCharacter = {
  code: 18,
  name: "Amber",
  // icon: "c/c6/Character_Amber_Thumb",
  icon: "7/75/Amber_Icon",
  sideIcon: "2/25/Outfit_100%25_Outrider_Side_Icon",
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
  isReverseXtraLv: true,
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: 36.12 },
        { name: "2-Hit", multFactors: 36.12 },
        { name: "3-Hit", multFactors: 46.44 },
        { name: "4-Hit", multFactors: 47.3 },
        { name: "5-Hit", multFactors: 59.34 },
      ],
    },
    CA: { stats: BOW_CAs },
    PA: { stats: LIGHT_PAs },
    ES: {
      name: "Explosive Puppet",
      image: "e/e0/Talent_Explosive_Puppet",
      stats: [
        {
          name: "Inherited HP",
          notAttack: "other",
          multFactors: { root: 41.4, attributeType: "hp" },
        },
        { name: "Explosion DMG", multFactors: 123.2 },
      ],
      // getExtraStats: () => [{ name: "CD", value: "15s" }],
    },
    EB: {
      name: "Fiery Rain",
      image: "6/6c/Talent_Fiery_Rain",
      stats: [
        { name: "Each Wave DMG", multFactors: 28.08 },
        { name: "Total DMG", multFactors: 505.44 },
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
      applyBuff: makeModApplier("attPattBonus", "EB.cRate_", 10),
    },
  ],
  buffs: [
    {
      index: 1,
      src: EModSrc.A4,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          Aimed Shot hits on weak spots increase <Green>ATK</Green> by <Green b>15%</Green> for 10s.
        </>
      ),
      isGranted: checkAscs[4],
      applyBuff: makeModApplier("totalAttr", "atk_", 15),
    },
    {
      index: 2,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          Increases Baron Bunny <Green>[ES] DMG</Green> via manual detonation by <Green b>200%</Green>.
        </>
      ),
      isGranted: checkCons[2],
      applyBuff: makeModApplier("attPattBonus", "ES.pct_", 200),
    },
    {
      index: 3,
      src: EModSrc.C6,
      affect: EModAffect.PARTY,
      desc: () => (
        <>
          Fiery Rain [EB] increases all party members' <Green>Movement SPD</Green> and <Green>ATK</Green> by{" "}
          <Green b>15%</Green> for 10s.
        </>
      ),
      isGranted: checkCons[6],
      applyBuff: makeModApplier("totalAttr", "atk_", 15),
    },
  ],
};

export default Amber;
