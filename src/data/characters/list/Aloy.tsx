import type { AppCharacter, CharInfo, DefaultAppCharacter, ModifierInput, PartyData } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { Cryo, Green, Lightgold, Red, Rose } from "@Src/pure-components";
import { round } from "@Src/utils";
import { applyModifier, finalTalentLv, makeModApplier } from "@Src/utils/calculation";
import { BOW_CAs, EModSrc, LIGHT_PAs } from "../constants";
import { checkAscs } from "../utils";

const getNApctBonus = (args: { char: CharInfo; partyData: PartyData; inputs: ModifierInput[] }) => {
  const level = finalTalentLv({
    char: args.char,
    charData: Aloy as AppCharacter,
    talentType: "ES",
    partyData: args.partyData,
  });
  let stacks = args.inputs[0] || 0;
  stacks = stacks === 4 ? 5 : stacks;
  return round(5.846 * TALENT_LV_MULTIPLIERS[5][level] * stacks, 2);
};

const Aloy: DefaultAppCharacter = {
  code: 39,
  name: "Aloy",
  icon: "e/e5/Aloy_Icon",
  sideIcon: "4/46/Aloy_Side_Icon",
  rarity: 5,
  nation: "outland",
  vision: "cryo",
  weaponType: "bow",
  EBcost: 40,
  stats: [
    [848, 18, 53],
    [2201, 47, 137],
    [2928, 63, 182],
    [4382, 94, 272],
    [4899, 105, 304],
    [5636, 121, 350],
    [6325, 136, 393],
    [7070, 152, 439],
    [7587, 163, 471],
    [8339, 179, 517],
    [8856, 190, 550],
    [9616, 206, 597],
    [10133, 217, 629],
    [10899, 234, 676],
  ],
  bonusStat: { type: "cryo", value: 7.2 },
  activeTalents: {
    NAs: {
      name: "Rapid Fire",
    },
    ES: {
      name: "Frozen Wilds",
      image: "9/9a/Talent_Frozen_Wilds",
    },
    EB: {
      name: "Prophecies of Dawn",
      image: "b/b4/Talent_Prophecies_of_Dawn",
    },
  },
  calcListConfig: {
    NA: {
      multScale: 4,
    },
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: [21.12, 23.76] },
      { name: "2-Hit", multFactors: 43.12 },
      { name: "3-Hit", multFactors: 52.8 },
      { name: "4-Hit", multFactors: 65.65 },
    ],
    CA: BOW_CAs,
    PA: LIGHT_PAs,
    ES: [
      { name: "Freeze Bomb", multFactors: 177.6 },
      { name: "Chillwater Bomblets", multFactors: 40 },
    ],
    EB: [{ name: "Skill DMG", multFactors: 359.2 }],
  },
  passiveTalents: [
    { name: "Combat Override", image: "0/01/Talent_Combat_Override" },
    { name: "Strong Strike", image: "b/ba/Talent_Strong_Strike" },
    { name: "Easy Does It", image: "0/0f/Talent_Easy_Does_It" },
  ],
  constellation: [],
  buffs: [
    {
      index: 0,
      src: "Coil stacks",
      affect: EModAffect.SELF,
      description: `Increases Aloy's {Normal Attack DMG}#[gr]. When she has 4 stacks, all stacks are cleared, Aloy
      then enters the Rushing Ice state, which further increases her {Normal Attack DMG}#[gr] and converts it to
      {Cryo DMG}#[cryo].
      <br />• At {A1}#[g] when Aloy receives Coil effect, her {ATK}#[gr] is increased by {16%}#[b,gr] for 10s.
      <br />• At {A4}#[g] when Aloy is in Rushing Ice state, her {Cryo DMG Bonus}#[gr] increases by {3.5%}#[b,gr]
      every 1s, up to {35%}#[r].`,
      inputConfigs: [
        {
          type: "stacks",
          max: 4,
        },
        {
          label: "Time passed (A4)",
          type: "stacks",
          max: 10,
        },
      ],
      applyBuff: (obj) => {
        const { char, desc, tracker } = obj;
        applyModifier(desc, obj.attPattBonus, "NA.pct_", getNApctBonus(obj), tracker);

        if (checkAscs[1](char)) {
          applyModifier(desc, obj.totalAttr, "atk_", 16, tracker);
        }
        if (checkAscs[4](char)) {
          applyModifier(desc, obj.totalAttr, "cryo", 3.5 * (obj.inputs[1] || 0), tracker);
        }
      },
      infuseConfig: {
        overwritable: false,
      },
    },
    {
      index: 2,
      src: EModSrc.A1,
      affect: EModAffect.TEAMMATE,
      description: `When Aloy receives the Coil effect, nearby party members' {ATK}#[gr] is increased by {8%}#[b,gr]
      for 10s.`,
      isGranted: checkAscs[1],
      applyBuff: makeModApplier("totalAttr", "atk_", 8),
    },
  ],
};

export default Aloy as AppCharacter;
