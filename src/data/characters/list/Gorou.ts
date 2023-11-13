import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { countVision } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons, getTalentMultiplier } from "../utils";

const getESBonus = (args: DescriptionSeedGetterArgs) => {
  return getTalentMultiplier({ talentType: "ES", root: 206 }, Gorou as AppCharacter, args);
};

const Gorou: DefaultAppCharacter = {
  code: 44,
  name: "Gorou",
  icon: "f/fe/Gorou_Icon",
  sideIcon: "7/7e/Gorou_Side_Icon",
  rarity: 4,
  nation: "inazuma",
  vision: "geo",
  weaponType: "bow",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  innateBuffs: [
    {
      src: EModSrc.A4,
      description: `• Inuzaka All-Round Defense {[ES] DMG}#[k] increased by {156%}#[v] of DEF.
      <br />• Juuga: Forward Unto Victory {[ES] DMG}#[k] increased by {15.6%}#[v] of DEF.`,
      isGranted: checkAscs[4],
      applyFinalBuff: ({ totalAttr, attPattBonus, desc, tracker }) => {
        const buffValues = [totalAttr.def * 1.56, totalAttr.def * 0.156];
        applyModifier(desc, attPattBonus, ["ES.flat", "EB.flat"], buffValues, tracker);
      },
    },
  ],
  dsGetters: [(args) => `${Math.round(getESBonus(args)[1])}`],
  buffs: [
    {
      index: 0,
      src: EModSrc.ES,
      affect: EModAffect.ACTIVE_UNIT,
      description: `Provides up to 3 buffs to active characters within the skill's AoE based on the number of {Geo}#[geo]
      characters in the party:
      <br />• 1 character: Adds "Standing Firm" - {@0}#[v] {DEF bonus}#[k]
      <br />• 2 characters: Adds "Impregnable" - Increased resistance to interruption.
      <br />• 3 characters: Adds "Crunch" - {15%}#[v] {Geo DMG Bonus}#[k].`,
      inputConfigs: [
        {
          label: "Elemental Skill Level",
          type: "level",
          for: "teammate",
        },
      ],
      applyBuff: (obj) => {
        const buffValue = getESBonus(obj)[1];
        const { geo = 0 } = countVision(obj.partyData, obj.charData);

        applyModifier(obj.desc, obj.totalAttr, "def", buffValue, obj.tracker);
        if (geo > 2) {
          applyModifier(obj.desc, obj.totalAttr, "geo", 15, obj.tracker);
        }
      },
    },
    {
      index: 1,
      src: EModSrc.A1,
      affect: EModAffect.PARTY,
      description: `After using Juuga: Forward Unto Victory [EB], all nearby party members' {DEF}#[k] is increased by
      {25%}#[v] for 12s.`,
      isGranted: checkAscs[1],
      applyBuff: makeModApplier("totalAttr", "def_", 25),
    },
    {
      index: 3,
      src: EModSrc.C6,
      affect: EModAffect.PARTY,
      description: `For 12s after using Inuzaka All-Round Defense [ES] or Juuga: Forward Unto Victory [EB], increases all nearby
      party members' {Geo CRIT DMG}#[k] based on the buff level of the skill's field:
      <br />• "Standing Firm": {10%}#[v]
      <br />• "Impregnable": {20%}#[v]
      <br />• "Crunch": {40%}#[v]`,
      isGranted: checkCons[6],
      applyBuff: (obj) => {
        const { geo = 0 } = countVision(obj.partyData, obj.charData);
        const buffValue = [10, 20, 40, 40][geo - 1];
        applyModifier(obj.desc, obj.attElmtBonus, "geo.cDmg_", buffValue, obj.tracker);
      },
    },
  ],
};

export default Gorou as AppCharacter;
