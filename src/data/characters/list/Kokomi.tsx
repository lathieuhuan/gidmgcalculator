import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { applyPercent } from "@Src/utils";
import { applyModifier, finalTalentLv, makeModApplier, type AttackPatternPath } from "@Src/utils/calculation";
import { EModSrc, LIGHT_PAs } from "../constants";
import { checkAscs, checkCons } from "../utils";

const Kokomi: DefaultAppCharacter = {
  code: 42,
  name: "Kokomi",
  GOOD: "SangonomiyaKokomi",
  icon: "f/ff/Sangonomiya_Kokomi_Icon",
  sideIcon: "c/c1/Sangonomiya_Kokomi_Side_Icon",
  rarity: 5,
  nation: "inazuma",
  vision: "hydro",
  weaponType: "catalyst",
  EBcost: 70,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
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
  bonusStat: {
    type: "hydro",
    value: 7.2,
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 68.38 },
      { name: "2-Hit", multFactors: 61.54 },
      { name: "3-Hit", multFactors: 94.31 },
    ],
    CA: [
      {
        name: "Charged Attack",
        multFactors: 148.32,
      },
    ],
    PA: LIGHT_PAs,
    ES: [
      {
        name: "Regeneration",
        type: "healing",
        multFactors: { root: 4.4, attributeType: "hp" },
        flatFactor: 424,
      },
      { name: "Ripple DMG", multFactors: 109.19 },
    ],
    EB: [
      {
        name: "Skill DMG",
        multFactors: { root: 10.42, attributeType: "hp" },
      },
      {
        name: "HP Regen. per Hit",
        type: "healing",
        multFactors: { root: 0.81, attributeType: "hp" },
        flatFactor: 77,
      },
    ],
  },
  activeTalents: {
    NAs: {
      name: "The Shape of Water",
    },
    ES: {
      name: "Kurage's Oath",
      image: "6/6e/Talent_Kurage%27s_Oath",
    },
    EB: {
      name: "Nereid's Ascension",
      image: "4/46/Talent_Nereid%27s_Ascension",
    },
  },
  passiveTalents: [
    { name: "Tamanooya's Casket", image: "c/cd/Talent_Tamanooya%27s_Casket" },
    { name: "Song of Pearls", image: "5/5f/Talent_Song_of_Pearls" },
    { name: "Princess of Watatsumi", image: "4/49/Talent_Princess_of_Watatsumi" },
    { name: "Flawless Strategy", image: "d/d5/Talent_Flawless_Strategy" },
  ],
  constellation: [
    { name: "At Water's Edge", image: "6/6b/Constellation_At_Water%27s_Edge" },
    { name: "The Clouds Like Waves Rippling", image: "9/9d/Constellation_The_Clouds_Like_Waves_Rippling" },
    { name: "The Moon, A Ship O'er_ the Seas", image: "c/cd/Constellation_The_Moon%2C_A_Ship_O%27er_the_Seas" },
    { name: "The Moon Overlooks the Waters", image: "f/fc/Constellation_The_Moon_Overlooks_the_Waters" },
    { name: "All Streams Flow to the Sea", image: "e/e4/Constellation_All_Streams_Flow_to_the_Sea" },
    { name: "Sango Isshin", image: "3/3b/Constellation_Sango_Isshin" },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      affect: EModAffect.SELF,
      description: `Kokomi's {Normal Attack, Charged Attack and Bake-Kurage DMG}#[gr] are increased based on her
      {Max HP}#[gr].
      <br />• At {A4}#[g], {Normal and Charged Attack DMG Bonus}#[gr] is further increasd based on {15%}#[b,gr] of her
      {Healing Bonus}#[gr].
      <br />• At {C4}#[g], Kokomi's {Normal Attack SPD}#[gr] is increased by {10%}#[b,gr].`,
      applyFinalBuff: (obj) => {
        const { char } = obj;
        const fields: AttackPatternPath[] = ["NA.flat", "CA.flat", "ES.flat"];
        const level = finalTalentLv({ ...obj, charData: Kokomi as AppCharacter, talentType: "EB" });

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
      description: `During Nereid's Ascension, Kokomi gains a {40%}#[b,gr] {Hydro DMG Bonus}#[gr] for 4s after her
      Normal and Charged Attacks heal, or would heal, any party member with 80% or more HP.`,
      isGranted: checkCons[6],
      applyBuff: makeModApplier("totalAttr", "hydro", 40),
    },
  ],
};

export default Kokomi as AppCharacter;
