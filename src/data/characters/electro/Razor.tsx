import type { DataCharacter } from "@Src/types";
import { Green } from "@Components/atoms";
import { EModAffect } from "@Src/constants";
import { EModSrc } from "../constants";
import { finalTalentLv, applyModifier, makeModApplier } from "@Src/utils/calculation";
import { checkCons } from "../utils";

const getEBBuffValue = (level: number) => {
  return Math.min(24 + level * 2 - Math.max(level - 6, 0), 40);
};

const Razor: DataCharacter = {
  code: 11,
  name: "Razor",
  // icon: "1/1d/Character_Razor_Thumb",
  icon: "b/b8/Razor_Icon",
  sideIcon: "5/57/Character_Razor_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "electro",
  weaponType: "claymore",
  stats: [
    [1003, 20, 63],
    [2577, 50, 162],
    [3326, 65, 209],
    [4982, 97, 313],
    [5514, 108, 346],
    [6343, 124, 398],
    [7052, 138, 443],
    [7881, 154, 495],
    [8413, 164, 528],
    [9241, 180, 580],
    [9773, 191, 613],
    [10602, 207, 665],
    [11134, 217, 699],
    [11962, 234, 751],
  ],
  bonusStat: { type: "phys", value: 7.5 },
  NAsConfig: {
    name: "Steel Fang",
  },
  isReverseXtraLv: true,
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: 95.92 },
        { name: "2-Hit", multFactors: 82.63 },
        { name: "3-Hit", multFactors: 103.31 },
        { name: "4-Hit", multFactors: 136.05 },
      ],
      multScale: 4,
    },
    CA: {
      stats: [
        { name: "Charged Attack Spinning", multFactors: 62.54 },
        { name: "Charged Attack Final", multFactors: 113.09 },
      ],
      multScale: 7,
    },
    PA: {
      stats: [
        { name: "Plunge DMG", multFactors: 82.05 },
        { name: "Low Plunge", multFactors: 164.06 },
        { name: "High Plunge", multFactors: 204.92 },
      ],
    },
    ES: {
      name: "Claw and Thunder",
      image: "0/06/Talent_Claw_and_Thunder",
      stats: [
        { name: "Press DMG", multFactors: 199.2 },
        { name: "Hold DMG", multFactors: 295.2 },
      ],
      // getExtraStats: () => [
      //   { name: "Energy Recharge Bonus", value: "20% per Electro Sigil" },
      //   { name: "Energy Regenerated", value: "5 per Electro Sigil Absorbed" },
      //   { name: "Electro Sigil Duration", value: "18s" },
      //   { name: "Press CD", value: "6s" },
      //   { name: "Hold CD", value: "10s" },
      // ],
    },
    EB: {
      name: "Lightning Fang",
      image: "3/3a/Talent_Lightning_Fang",
      stats: [{ name: "Burst DMG", multFactors: 160 }],
      // getExtraStats: (lv) => [
      //   {
      //     name: "Soul Companion DMG",
      //     value: round(24 * TALENT_LV_MULTIPLIERS[2][lv], 1) + "% Normal Attack DMG",
      //   },
      //   {
      //     name: "Normal ATK SPD Bonus",
      //     value: getEBBuffValue(lv) + "%",
      //   },
      //   { name: "Electro RES Bonus", value: "80%" },
      //   { name: "Duration", value: "15s" },
      //   { name: "CD", value: "20s" },
      // ],
      energyCost: 80,
    },
  },
  passiveTalents: [
    { name: "Awakening", image: "5/5c/Talent_Awakening" },
    { name: "Hunger", image: "b/be/Talent_Hunger" },
    { name: "Wolvensprint", image: "0/0a/Talent_Wolvensprint" },
  ],
  constellation: [
    { name: "Wolf's Instinct", image: "c/cf/Constellation_Wolf%27s_Instinct" },
    { name: "Suppression", image: "1/16/Constellation_Suppression" },
    { name: "Soul Companion", image: "6/6a/Constellation_Soul_Companion" },
    { name: "Bite", image: "0/01/Constellation_Bite" },
    { name: "Sharpened Claws", image: "c/c4/Constellation_Sharpened_Claws" },
    { name: "Lupus Fulguris", image: "1/12/Constellation_Lupus_Fulguris" },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      affect: EModAffect.SELF,
      desc: ({ char, partyData }) => (
        <>
          Raises Razor's <Green>ATK SPD</Green> by{" "}
          <Green b>
            {getEBBuffValue(finalTalentLv({ char, dataChar: Razor, talentType: "EB", partyData }))}%
          </Green>
          .
        </>
      ),
      applyBuff: ({ totalAttr, char, partyData, desc, tracker }) => {
        const level = finalTalentLv({
          char,
          dataChar: Razor,
          talentType: "EB",
          partyData,
        });
        applyModifier(desc, totalAttr, "naAtkSpd", getEBBuffValue(level), tracker);
      },
    },
    {
      index: 1,
      src: EModSrc.C1,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          Picking up an Elemental Orb or Particle increases Razor's <Green>DMG</Green> by{" "}
          <Green b>10%</Green> for 8s.
        </>
      ),
      isGranted: checkCons[1],
      applyBuff: makeModApplier("attPattBonus", "all.pct", 10),
    },
    {
      index: 2,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          Increases <Green>CRIT Rate</Green> against opponents with less than 30% HP by{" "}
          <Green b>10%</Green>.
        </>
      ),
      isGranted: checkCons[2],
      applyBuff: makeModApplier("totalAttr", "cRate", 10),
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C4,
      desc: () => (
        <>
          Claw and Thunder [ES] (Press) decreases opponents' <Green>DEF</Green> by{" "}
          <Green b>15%</Green> for 7s.
        </>
      ),
      isGranted: checkCons[4],
      applyDebuff: makeModApplier("resistReduct", "def", 15),
    },
  ],
};

export default Razor;
