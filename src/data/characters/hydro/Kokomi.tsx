import type { DataCharacter } from "@Src/types";
import { Green, Lightgold } from "@Components/atoms";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { EModSrc, LIGHT_PAs } from "../constants";
import { applyPercent } from "@Src/utils";
import { finalTalentLv, applyModifier, makeModApplier, type AttackPatternPath } from "@Src/utils/calculation";
import { checkAscs, checkCons } from "../utils";

const Kokomi: DataCharacter = {
  code: 42,
  name: "Kokomi",
  GOOD: "SangonomiyaKokomi",
  // icon: "c/cc/Character_Sangonomiya_Kokomi_Thumb",
  icon: "f/ff/Sangonomiya_Kokomi_Icon",
  sideIcon: "b/b4/Character_Sangonomiya_Kokomi_Side_Icon",
  rarity: 5,
  nation: "inazuma",
  vision: "hydro",
  weaponType: "catalyst",
  stats: [
    [1049, 18, 51],
    [2720, 47, 133],
    [3619, 63, 177],
    [5416, 94, 264],
    [6055, 105, 295],
    [6966, 121, 340],
    [7818, 136, 381],
    [8738, 152, 426],
    [9377, 163, 457],
    [10306, 179, 503],
    [10945, 190, 534],
    [11885, 207, 580],
    [12524, 218, 611],
    [13471, 234, 657],
  ],
  bonusStat: { type: "hydro", value: 7.2 },
  NAsConfig: {
    name: "The Shape of Water",
  },
  isReverseXtraLv: true,
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: 68.38 },
        { name: "2-Hit", multFactors: 61.54 },
        { name: "3-Hit", multFactors: 94.31 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack", multFactors: 148.32 }] },
    PA: { stats: LIGHT_PAs },
    ES: {
      name: "Kurage's Oath",
      image: "6/6e/Talent_Kurage%27s_Oath",
      stats: [
        {
          name: "Regeneration",
          notAttack: "healing",
          multFactors: { root: 4.4, attributeType: "hp" },
          flatFactor: 424,
        },
        { name: "Ripple DMG", multFactors: 109.19 },
      ],
      // getExtraStats: () => [
      //   { name: "Duration", value: "12s" },
      //   { name: "CD", value: "20s" },
      // ],
    },
    EB: {
      name: "Nereid's Ascension",
      image: "4/46/Talent_Nereid%27s_Ascension",
      stats: [
        { name: "Skill DMG", multFactors: 10.42 },
        {
          name: "HP Regen. per Hit",
          notAttack: "healing",
          multFactors: 0.81,
          flatFactor: 77,
        },
      ],
      multAttributeType: "hp",
      // getExtraStats: () => [
      //   { name: "Duration", value: "10s" },
      //   { name: "CD", value: "18s" },
      // ],
      energyCost: 70,
    },
  },
  passiveTalents: [
    { name: "Tamanooya's Casket", image: "c/cd/Talent_Tamanooya%27s_Casket" },
    { name: "Song of Pearls", image: "5/5f/Talent_Song_of_Pearls" },
    { name: "Princess of Watatsumi", image: "4/49/Talent_Princess_of_Watatsumi" },
    {
      name: "Flawless Strategy",
      image: "d/d5/Talent_Flawless_Strategy",
    },
  ],
  constellation: [
    { name: "At Water's Edge", image: "6/6b/Constellation_At_Water%27s_Edge" },
    {
      name: "The Clouds Like Waves Rippling",
      image: "9/9d/Constellation_The_Clouds_Like_Waves_Rippling",
    },
    {
      name: "The Moon, A Ship O'er_ the Seas",
      image: "c/cd/Constellation_The_Moon%2C_A_Ship_O%27er_the_Seas",
    },
    {
      name: "The Moon Overlooks the Waters",
      image: "f/fc/Constellation_The_Moon_Overlooks_the_Waters",
    },
    {
      name: "All Streams Flow to the Sea",
      image: "e/e4/Constellation_All_Streams_Flow_to_the_Sea",
    },
    { name: "Sango Isshin", image: "3/3b/Constellation_Sango_Isshin" },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          Kokomi's <Green>Normal Attack, Charged Attack and Bake-Kurage DMG</Green> are increased based on her{" "}
          <Green>Max HP</Green>.
          <br />• At <Lightgold>A4</Lightgold>, <Green>Normal and Charged Attack DMG Bonus</Green> is further increasd
          based on <Green b>15%</Green> of her <Green>Healing Bonus</Green>.
          <br />• At <Lightgold>C4</Lightgold>, Kokomi's <Green>Normal Attack SPD</Green> is increased by{" "}
          <Green b>10%</Green>.
        </>
      ),
      applyFinalBuff: (obj) => {
        const { char } = obj;
        const fields: AttackPatternPath[] = ["NA.flat", "CA.flat", "ES.flat"];
        const level = finalTalentLv({ ...obj, dataChar: Kokomi, talentType: "EB" });

        const buffValues = [4.84, 6.78, 7.1].map((mult, i) => {
          let finalMult = mult * TALENT_LV_MULTIPLIERS[2][level];
          if (i !== 2 && checkAscs[4](char)) {
            finalMult += obj.totalAttr.healB_ * 0.15;
          }
          return applyPercent(obj.totalAttr.hp, finalMult);
        });
        applyModifier(obj.desc, obj.attPattBonus, fields, buffValues, obj.tracker);

        if (checkCons[4](char)) {
          applyModifier(`Self / ${EModSrc.C4}`, obj.totalAttr, "naAtkSpd_", 10, obj.tracker);
        }
      },
    },
    {
      index: 3,
      src: EModSrc.C6,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          During Nereid's Ascension, Kokomi gains a <Green b>40%</Green> <Green>Hydro DMG Bonus</Green> for 4s after her
          Normal and Charged Attacks heal, or would heal, any party member with 80% or more HP.
        </>
      ),
      isGranted: checkCons[6],
      applyBuff: makeModApplier("totalAttr", "hydro", 40),
    },
  ],
};

export default Kokomi;
