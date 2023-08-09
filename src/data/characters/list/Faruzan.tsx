import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { applyPercent, round } from "@Src/utils";
import { applyModifier, finalTalentLv, makeModApplier } from "@Src/utils/calculation";
import { BOW_CAs, EModSrc, LIGHT_PAs } from "../constants";
import { checkAscs, checkCons } from "../utils";

const getWindGiftBuffResult = ({ fromSelf, inputs, char, partyData }: DescriptionSeedGetterArgs) => {
  const level = fromSelf
    ? finalTalentLv({ talentType: "EB", char, charData: Faruzan as AppCharacter, partyData })
    : inputs[0] || 0;

  if (level) {
    const mult = round(18 * TALENT_LV_MULTIPLIERS[2][level], 2);
    return [level, mult];
  }
  return [0, 0];
};

const Faruzan: DefaultAppCharacter = {
  code: 64,
  name: "Faruzan",
  icon: "b/b2/Faruzan_Icon",
  sideIcon: "c/c1/Faruzan_Side_Icon",
  rarity: 4,
  nation: "sumeru",
  vision: "anemo",
  weaponType: "bow",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  stats: [
    [802, 16, 53],
    [2061, 42, 135],
    [2661, 55, 175],
    [3985, 82, 262],
    [4411, 91, 289],
    [5074, 104, 333],
    [5642, 116, 370],
    [6305, 129, 414],
    [6731, 138, 442],
    [7393, 152, 485],
    [7819, 161, 513],
    [8481, 174, 556],
    [8907, 183, 584],
    [9570, 196, 628],
  ],
  bonusStat: {
    type: "atk_",
    value: 6,
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 44.73 },
      { name: "2-Hit", multFactors: 42.19 },
      { name: "3-Hit", multFactors: 53.16 },
      { name: "4-Hit", multFactors: 70.62 },
    ],
    CA: BOW_CAs,
    PA: LIGHT_PAs,
    ES: [
      { name: "Skill DMG", multFactors: 148.8 },
      { name: "Pressurized Collapse Vortex DMG", multFactors: 108 },
    ],
    EB: [
      {
        name: "Skill DMG",
        multFactors: 377.6,
      },
    ],
  },
  activeTalents: {
    NAs: {
      name: "Parthian Shot",
    },
    ES: {
      name: "Wind Realm of Nasamjnin",
      image: "4/46/Talent_Wind_Realm_of_Nasamjnin",
    },
    EB: {
      name: "The Wind's Secret Ways",
      image: "f/fc/Talent_The_Wind%27s_Secret_Ways",
    },
  },
  passiveTalents: [
    { name: "Impetuous Flow", image: "7/7f/Talent_Impetuous_Flow" },
    { name: "Lost Wisdom of the Seven Caverns", image: "3/35/Talent_Lost_Wisdom_of_the_Seven_Caverns" },
    { name: "Tomes Light the Path", image: "2/23/Talent_Tomes_Light_the_Path" },
  ],
  constellation: [
    { name: "Truth by Any Means", image: "f/f2/Constellation_Truth_by_Any_Means" },
    { name: "Overzealous Intellect", image: "5/5b/Constellation_Overzealous_Intellect" },
    { name: "Spirit-Orchard Stroll", image: "b/b5/Constellation_Spirit-Orchard_Stroll" },
    { name: "Divine Comprehension", image: "8/82/Constellation_Divine_Comprehension" },
    { name: "Wonderland of Rumination", image: "f/f7/Constellation_Wonderland_of_Rumination" },
    { name: "The Wondrous Path of Truth", image: "9/9a/Constellation_The_Wondrous_Path_of_Truth" },
  ],
  dsGetters: [(args) => `${getWindGiftBuffResult(args)[1]}%`],
  buffs: [
    {
      index: 0,
      src: "Prayerful Wind's Benefit",
      affect: EModAffect.PARTY,
      description: `Increases {Anemo DMG Bonus}#[gr] by {@0}#[b,gr] to all nearby characters.
      <br />• At {A4}#[g], increases {Anemo DMG}#[anemo] based on {32%}#[b,gr] of Faruzan's {Base ATK}#[gr].
      <br />• At {C6}#[g], increases {Anemo CRIT DMG}#[gr] by {40%}#[b,gr].`,
      inputConfigs: [
        { label: "Elemental Burst Level", type: "level", for: "teammate" },
        { label: "Ascension 4", type: "check", for: "teammate" },
        { label: "Base ATK (A4)", type: "text", max: 9999, for: "teammate" },
        { label: "Constellation 6", type: "check", for: "teammate" },
      ],
      applyFinalBuff: (obj) => {
        const { fromSelf, attElmtBonus, inputs } = obj;
        const [EBlevel, anemoBonus] = getWindGiftBuffResult(obj);

        applyModifier(obj.desc, obj.totalAttr, "anemo", anemoBonus, obj.tracker);

        if (fromSelf ? checkAscs[4](obj.char) : inputs[1]) {
          const baseAtk = fromSelf ? obj.totalAttr.base_atk : inputs[2] || 0;
          const mult = 32;
          const description = obj.desc + ` Lv. ${EBlevel} / ${mult}% of ${baseAtk} Base ATK`;

          applyModifier(description, attElmtBonus, "anemo.flat", applyPercent(baseAtk, mult), obj.tracker);
        }
        if (fromSelf ? checkCons[6](obj.char) : inputs[3]) {
          const description = `${fromSelf ? "Self" : "Faruzan"} / ${EModSrc.C6}`;
          applyModifier(description, attElmtBonus, "anemo.cDmg_", 40, obj.tracker);
        }
      },
    },
  ],
  debuffs: [
    {
      index: 0,
      src: "Perfidious Wind's Bale",
      description: `Decreases opponents' {Anemo RES}#[gr] by {30%}#[b,gr].`,
      applyDebuff: makeModApplier("resistReduct", "anemo", 30),
    },
  ],
};

export default Faruzan as AppCharacter;
