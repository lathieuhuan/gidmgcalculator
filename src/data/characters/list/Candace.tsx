import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { round } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { checkAscs, checkCons } from "../utils";

const Candace: DefaultAppCharacter = {
  code: 58,
  name: "Candace",
  icon: "d/dd/Candace_Icon",
  sideIcon: "7/7f/Candace_Side_Icon",
  rarity: 4,
  nation: "sumeru",
  vision: "hydro",
  weaponType: "polearm",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  stats: [
    [912, 18, 57],
    [2342, 46, 147],
    [3024, 59, 190],
    [4529, 88, 284],
    [5013, 98, 315],
    [5766, 113, 362],
    [6411, 125, 402],
    [7164, 140, 450],
    [7648, 149, 480],
    [8401, 164, 527],
    [8885, 174, 558],
    [9638, 188, 605],
    [10122, 198, 635],
    [10875, 212, 683],
  ],
  bonusStat: {
    type: "hp_",
    value: 6,
  },
  calcListConfig: {
    ES: { multAttributeType: "hp" },
    EB: { multAttributeType: "hp" },
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 60.8 },
      { name: "2-Hit", multFactors: 61.15 },
      { name: "3-Hit", multFactors: [35.49, 43.37] },
      { name: "4-Hit", multFactors: 94.94 },
    ],
    CA: [
      {
        name: "Charged Attack DMG",
        multFactors: 124.18,
      },
    ],
    PA: MEDIUM_PAs,
    ES: [
      { name: "Shield DMG Absorption", multFactors: 12, flatFactor: 1156 },
      { name: "Basic DMG", multFactors: 12 },
      { name: "Charged Up DMG", multFactors: 19.04 },
    ],
    EB: [
      { name: "Skill DMG", multFactors: 6.61 },
      { name: "Wave Impact DMG", multFactors: 6.61 },
      {
        name: "Wave DMG (C6)",
        multFactors: { root: 15, scale: 0 },
      },
    ],
  },
  activeTalents: {
    NAs: {
      name: "Gleaming Spear - Guardian Stance",
    },
    ES: {
      name: "Sacred Rite: Heron's Sanctum",
      image: "5/5d/Talent_Sacred_Rite_Heron%27s_Sanctum",
    },
    EB: {
      name: "Sacred Rite: Wagtail's Tide",
      image: "1/1a/Talent_Sacred_Rite_Wagtail%27s_Tide",
    },
  },
  passiveTalents: [
    { name: "Featherflow Guard", image: "3/33/Talent_Aegis_of_Crossed_Arrows" },
    { name: "Celestial Dome of Sand", image: "8/86/Talent_Celestial_Dome_of_Sand" },
    { name: "To Dawn's First Light", image: "a/a6/Talent_To_Dawn%27s_First_Light" },
  ],
  constellation: [
    { name: "Returning Heir of the Scarlet Sands", image: "1/1d/Constellation_Returning_Heiress_of_the_Scarlet_Sands" },
    { name: "Moon-Piercing Brilliance", image: "3/3b/Constellation_Moon-Piercing_Brilliance" },
    { name: "Hunter's Supplication", image: "f/f2/Constellation_Hunter%27s_Supplication" },
    { name: "Sentinel Oath", image: "b/b7/Constellation_Sentinel_Oath" },
    { name: "Golden Eye", image: "f/fc/Constellation_Heterochromatic_Gaze" },
    { name: "The Overflow", image: "e/ec/Constellation_The_Overflow" },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      affect: EModAffect.PARTY,
      description: `Prayer of the Crimson Crown [~EB] grants:
      <br />• Characters deal {20%}#[b,gr] increased {Elemental Normal Attack DMG}#[gr].
      <br />• At {A4}#[g], increases the above bonus by {0.5%}#[b,gr] for every 1,000 points of Candace's {Max HP}#[gr].`,
      inputConfigs: [
        {
          label: "Max HP (A4)",
          type: "text",
          max: 99999,
          for: "teammate",
        },
      ],
      applyFinalBuff: (obj) => {
        const { toSelf, char, charData, totalAttr, attPattBonus, inputs } = obj;

        if (charData.weaponType === "catalyst" || obj.infusedElement !== "phys") {
          const maxHP = toSelf && checkAscs[4](char) ? totalAttr.hp : !toSelf ? inputs[0] || 0 : 0;
          const buffValue = round(20 + (maxHP / 1000) * 0.5, 1);

          applyModifier(obj.desc, attPattBonus, "NA.pct_", buffValue, obj.tracker);
        }
      },
    },
    {
      index: 2,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      description: `When Sacred Rite: Heron's Guard [ES] hits opponents, Candace's {Max HP}#[gr] will be increased by
      {20%}#[b,gr] for 15s.`,
      isGranted: checkCons[2],
      applyBuff: makeModApplier("totalAttr", "hp_", 20),
    },
  ],
};

export default Candace as AppCharacter;
