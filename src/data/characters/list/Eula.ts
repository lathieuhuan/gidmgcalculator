import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyModifier, finalTalentLv, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkCons, genExclusiveBuff } from "../utils";

const getESPenalty = (args: DescriptionSeedGetterArgs) => {
  const level = args.fromSelf
    ? finalTalentLv({ talentType: "ES", char: args.char, charData: Eula as AppCharacter, partyData: args.partyData })
    : args.inputs[0] || 0;

  if (level) {
    const value = Math.min(15 + level, 25);
    return [level, value];
  }
  return [0, 0];
};

const Eula: DefaultAppCharacter = {
  code: 33,
  name: "Eula",
  icon: "a/af/Eula_Icon",
  sideIcon: "8/8d/Eula_Side_Icon",
  rarity: 5,
  nation: "mondstadt",
  vision: "cryo",
  weaponType: "claymore",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  dsGetters: [(args) => `${getESPenalty(args)[1]}%`],
  buffs: [
    {
      index: 0,
      src: EModSrc.C1,
      affect: EModAffect.SELF,
      description: `Every time Grimheart stacks [~ES] are consumed, Eula's {Physical DMG}#[gr] is increased by
      {30%}#[b,gr] for 6s. Each stack consumed increases the duration by 6s.`,
      isGranted: checkCons[1],
      applyBuff: makeModApplier("totalAttr", "phys", 30),
    },
    {
      index: 1,
      src: EModSrc.C4,
      affect: EModAffect.SELF,
      description: `{Lightfall Swords DMG}#[gr] [~EB] is increased by {25%}#[b,gr] against opponents with less than 50%
      HP.`,
      isGranted: checkCons[4],
      applyBuff: ({ calcItemBuffs }) => {
        calcItemBuffs.push(genExclusiveBuff(EModSrc.C4, "EB.0", "pct_", 25));
      },
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.ES,
      description: `If Grimheart stacks are consumed, surrounding opponents will have their {Physical RES}#[gr] and
      {Cryo RES}#[gr] decreased by {@0}#[b,gr].`,
      inputConfigs: [
        {
          label: "Elemental Skill Level",
          type: "level",
          for: "teammate",
        },
      ],
      applyDebuff: (obj) => {
        const [level, penalty] = getESPenalty(obj);
        applyModifier(obj.desc + ` Lv.${level}`, obj.resistReduct, ["phys", "cryo"], penalty, obj.tracker);
      },
    },
  ],
};

export default Eula as AppCharacter;
