import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc, TRAVELER_INFO, TRAVELLER_NCPAs } from "../constants";
import { checkAscs, checkCons } from "../utils";

const ElectroTraveler: DefaultAppCharacter = {
  code: 46,
  name: "Electro Traveler",
  ...TRAVELER_INFO,
  vision: "electro",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  calcList: {
    ...TRAVELLER_NCPAs,
    ES: [
      {
        name: "Skill DMG",
        multFactors: 78.66,
      },
    ],
    EB: [
      { name: "Skill DMG", multFactors: 114.4 },
      { name: "Falling Thunder", multFactors: 32.8 },
    ],
  },
  activeTalents: {
    NAs: {
      name: "Foreign Thundershock",
    },
    ES: {
      name: "Lightning Blade",
      image: "0/03/Talent_Lightning_Blade",
    },
    EB: {
      name: "Bellowing Thunder",
      image: "a/a7/Talent_Bellowing_Thunder",
    },
  },
  passiveTalents: [
    { name: "Thunderflash", image: "1/16/Talent_Thunderflash" },
    { name: "Resounding Roar", image: "2/26/Talent_Resounding_Roar" },
  ],
  constellation: [
    { name: "Spring Thunder of Fertility", image: "2/2f/Constellation_Spring_Thunder_of_Fertility" },
    { name: "Violet Vehemence", image: "8/8f/Constellation_Violet_Vehemence" },
    { name: "Distant Crackling", image: "c/c0/Constellation_Distant_Crackling" },
    { name: "Fickle Cloudstrike", image: "8/84/Constellation_Fickle_Cloudstrike" },
    { name: "Clamor in the Wilds", image: "8/80/Constellation_Clamor_in_the_Wilds" },
    { name: "World-Shaker", image: "7/76/Constellation_World-Shaker" },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.ES,
      affect: EModAffect.ONE_UNIT,
      description: `Increases {Energy Recharge}#[gr] during the Abundance Amulet's [~ES] duration.
      <br />• At {A4}#[g], increases the bonus by {10%}#[b,gr] of the Traveler's {Energy Recharge}#[gr].`,
      inputConfigs: [
        { label: "A4 Passive", type: "check", for: "teammate" },
        { label: "Energy Recharge", type: "text", initialValue: 100, max: 999, for: "teammate" },
      ],
      applyBuff: ({ totalAttr, char, inputs, fromSelf, desc, tracker }) => {
        let buffValue = 20;
        const boosted = fromSelf ? checkAscs[4](char) : inputs[0] === 1;

        if (boosted) {
          const ER = fromSelf ? totalAttr.er_ : inputs[1] || 0;
          buffValue += Math.round(ER) / 10;
        }
        applyModifier(desc, totalAttr, "er_", buffValue, tracker);
      },
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C2,
      description: `When Falling Thunder [~EB] hits an opponent, it will decrease their {Electro RES}#[gr] by
      {15%}#[b,gr] for 8s.`,
      isGranted: checkCons[2],
      applyDebuff: makeModApplier("resistReduct", "electro", 15),
    },
  ],
};

export default ElectroTraveler as AppCharacter;
