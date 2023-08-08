import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect, VISION_TYPES } from "@Src/constants";
import { round } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { checkAscs } from "../utils";

const Kirara: DefaultAppCharacter = {
  code: 71,
  name: "Kirara",
  icon: "https://images2.imgbox.com/4c/09/DLJYSuy8_o.png",
  sideIcon: "1/1b/Kirara_Side_Icon",
  rarity: 4,
  nation: "inazuma",
  vision: "dendro",
  weaponType: "sword",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  stats: [
    [1021, 19, 46],
    [2623, 48, 118],
    [3386, 62, 152],
    [5072, 93, 227],
    [5614, 103, 252],
    [6458, 118, 290],
    [7181, 131, 322],
    [8024, 147, 360],
    [8566, 157, 384],
    [9409, 172, 422],
    [9951, 182, 446],
    [10794, 198, 484],
    [11336, 208, 508],
    [12180, 223, 546],
  ],
  bonusStat: {
    type: "hp_",
    value: 6,
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 47.9 },
      { name: "2-Hit", multFactors: 46.35 },
      { name: "3-Hit", multFactors: [25.42, 38.13] },
      { name: "4-Hit", multFactors: 73.27 },
    ],
    CA: [{ name: "Charged Attack", multFactors: [22.38, 44.75, 44.75] }],
    PA: MEDIUM_PAs,
    ES: [
      { name: "Tail-Flicking Flying Kick", multFactors: 104 },
      { name: "Urgent Neko Parcel Hit", multFactors: 33.6 },
      { name: "Flipclaw Strike", multFactors: 144 },
      {
        name: "Shield DMG Absorption",
        type: "shield",
        multFactors: { root: 10, attributeType: "hp" },
        flatFactor: 962,
      },
      {
        name: "Max Shield DMG Absorption",
        type: "shield",
        multFactors: { root: 16, attributeType: "hp" },
        flatFactor: 1541,
      },
    ],
    EB: [
      { name: "Skill DMG", multFactors: 570.24 },
      { name: "Cat Grass Cardamom Explosion", multFactors: 35.64 },
      { name: "Small Cat Grass Cardamoms (C4)", multFactors: { root: 200, scale: 0 } },
    ],
  },
  activeTalents: {
    NAs: {
      name: "Boxcutter",
    },
    ES: {
      name: "Meow-teor Kick",
      image: "7/79/Talent_Meow-teor_Kick",
    },
    EB: {
      name: "Secret Art: Surprise Dispatch",
      image: "a/a1/Talent_Secret_Art_Surprise_Dispatch",
    },
  },
  passiveTalents: [
    { name: "Bewitching, Betwitching Tails", image: "5/56/Talent_Bewitching%2C_Betwitching_Tails" },
    { name: "Pupillary Variance", image: "a/a3/Talent_Pupillary_Variance" },
    { name: "Cat's Creeping Carriage", image: "5/51/Talent_Cat%27s_Creeping_Carriage" },
  ],
  constellation: [
    { name: "Material Circulation", image: "2/26/Constellation_Material_Circulation" },
    { name: "Perfectly Packaged", image: "8/83/Constellation_Perfectly_Packaged" },
    { name: "Universal Recognition", image: "e/ea/Constellation_Universal_Recognition" },
    { name: "Steed of Skanda", image: "7/72/Constellation_Steed_of_Skanda" },
    { name: "A Thousand Miles in a Day", image: "e/e4/Constellation_A_Thousand_Miles_in_a_Day" },
    { name: "Countless Sights to See", image: "9/95/Constellation_Countless_Sights_to_See" },
  ],
  innateBuffs: [
    {
      src: EModSrc.A4,
      description: `Every 1,000 Max HP Kirara possesses will increase the Meow-teor Kick {[ES] DMG}#[gr] by {0.4%}#[b,gr],
      and the Secret Art: Surprise Dispatch {[EB] DMG}#[gr] by {0.3%}#[b,gr].`,
      isGranted: checkAscs[4],
      applyFinalBuff: ({ totalAttr, attPattBonus, desc, tracker }) => {
        const stacks = totalAttr.hp / 1000;
        const ESBuffValue = round(stacks * 0.4, 1);
        const EBBuffValue = round(stacks * 0.3, 1);
        applyModifier(desc, attPattBonus, ["ES.pct_", "EB.pct_"], [ESBuffValue, EBBuffValue], tracker);
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      affect: EModAffect.PARTY,
      description: `All nearby party members will gain {12%}#[b,gr] {All Elemental DMG Bonus}#[gr] within 15s after
      Kirara uses her Elemental Skill or Burst.`,
      applyBuff: makeModApplier("totalAttr", [...VISION_TYPES], 12),
    },
  ],
};

export default Kirara as AppCharacter;
