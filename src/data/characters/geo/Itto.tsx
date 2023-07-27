import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { Geo, Green } from "@Src/pure-components";
import { applyPercent } from "@Src/utils";
import { applyModifier, finalTalentLv, makeModApplier } from "@Src/utils/calculation";
import { EModSrc, HEAVIER_PAs } from "../constants";
import { checkAscs, checkCons, exclBuff } from "../utils";

const Itto: DefaultAppCharacter = {
  code: 45,
  name: "Itto",
  GOOD: "AratakiItto",
  icon: "7/7b/Arataki_Itto_Icon",
  sideIcon: "c/c8/Arataki_Itto_Side_Icon",
  rarity: 5,
  nation: "inazuma",
  vision: "geo",
  weaponType: "claymore",
  EBcost: 70,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  stats: [
    [1001, 18, 75],
    [2597, 46, 194],
    [3455, 61, 258],
    [5170, 91, 386],
    [5779, 102, 431],
    [6649, 117, 496],
    [7462, 132, 557],
    [8341, 147, 622],
    [8951, 158, 668],
    [9838, 174, 734],
    [10448, 185, 779],
    [11345, 200, 846],
    [11954, 211, 892],
    [12858, 227, 959],
  ],
  bonusStat: {
    type: "cRate_",
    value: 4.8,
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 79.23 },
      { name: "2-Hit", multFactors: 76.37 },
      { name: "3-Hit", multFactors: 91.64 },
      { name: "4-Hit", multFactors: 117.22 },
    ],
    CA: [
      { id: "CA.0", name: "Arataki Kesagiri Combo Slash DMG", multFactors: 91.16 },
      { id: "CA.1", name: "Arataki Kesagiri Final Slash DMG", multFactors: 190.92 },
      { name: "Saichimonji Slash DMG", multFactors: 90.47 },
    ],
    PA: HEAVIER_PAs,
    ES: [
      {
        name: "Skill DMG",
        multFactors: 307.2,
      },
    ],
    EB: [],
  },
  activeTalents: {
    NAs: {
      name: "Fight Club Legend",
    },
    ES: {
      name: "Masatsu Zetsugi: Akaushi Burst!",
      image: "5/51/Talent_Masatsu_Zetsugi_Akaushi_Burst%21",
    },
    EB: {
      name: "Royal Descent: Behold, Itto the Evil!",
      image: "5/50/Talent_Royal_Descent_Behold%2C_Itto_the_Evil%21",
    },
  },
  passiveTalents: [
    { name: "Arataki Ichiban", image: "a/a5/Talent_Arataki_Ichiban" },
    { name: "Bloodline of the Crimson Oni", image: "d/db/Talent_Bloodline_of_the_Crimson_Oni" },
    { name: "Woodchuck Chucked", image: "4/47/Talent_Woodchuck_Chucked" },
  ],
  constellation: [
    { name: "Stay a While and Listen Up", image: "6/64/Constellation_Stay_a_While_and_Listen_Up" },
    {
      name: "Gather 'Round, It's a Brawl!",
      image: "0/09/Constellation_Gather_%27Round%2C_It%27s_a_Brawl%21",
    },
    {
      name: "Horns Lowered, Coming Through",
      image: "a/a5/Constellation_Horns_Lowered%2C_Coming_Through",
    },
    { name: "Jailhouse Bread and Butter", image: "d/d4/Constellation_Jailhouse_Bread_and_Butter" },
    {
      name: "10 Years of Hanamizaka Fame",
      image: "f/f3/Constellation_10_Years_of_Hanamizaka_Fame",
    },
    { name: "Arataki Itto, Present!", image: "8/89/Constellation_Arataki_Itto%2C_Present%21" },
  ],
  innateBuffs: [
    {
      src: EModSrc.A4,
      desc: () => (
        <>
          <Green>Arataki Kesagiri DMG</Green> is increased by <Green b>35%</Green> of Itto's <Green>DEF</Green>.
        </>
      ),
      isGranted: checkAscs[4],
      applyFinalBuff: ({ calcItemBuffs, totalAttr }) => {
        calcItemBuffs.push(exclBuff(EModSrc.A4, ["CA.0", "CA.1"], "flat", applyPercent(totalAttr.def, 35)));
      },
    },
    {
      src: EModSrc.C6,
      desc: () => (
        <>
          Itto's <Green>Charged Attacks</Green> deal <Green b>+70%</Green> <Green>CRIT DMG</Green>.
        </>
      ),
      isGranted: checkCons[6],
      applyBuff: makeModApplier("attPattBonus", "CA.cDmg_", 70),
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          • Grants Itto a <Geo>Geo Infusion</Geo> that cannot be overridden.
          <br />• Increases Itto's <Green>Normal Attack SPD</Green> by <Green b>10%</Green>. Also increases his{" "}
          <Green>ATK</Green> based on his <Green>DEF</Green>.
        </>
      ),
      applyFinalBuff: ({ totalAttr, char, partyData, desc, tracker }) => {
        const level = finalTalentLv({
          char,
          charData: Itto as AppCharacter,
          talentType: "EB",
          partyData,
        });
        const buffValue = applyPercent(totalAttr.def, 57.6 * TALENT_LV_MULTIPLIERS[2][level]);
        applyModifier(desc, totalAttr, ["atk", "naAtkSpd_"], [buffValue, 10], tracker);
      },
      infuseConfig: {
        overwritable: false,
      },
    },
    {
      index: 2,
      src: EModSrc.C4,
      affect: EModAffect.PARTY,
      desc: () => (
        <>
          When the Raging Oni King state [EB] ends, all nearby party members gain <Green b>20%</Green>{" "}
          <Green>DEF</Green> and <Green b>20%</Green> <Green>ATK</Green> for 10s.
        </>
      ),
      isGranted: checkCons[4],
      applyBuff: makeModApplier("totalAttr", ["def_", "atk_"], 20),
    },
  ],
};

export default Itto as AppCharacter;
