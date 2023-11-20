import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { applyModifier, finalTalentLv } from "@Src/utils/calculation";
import { EModSrc } from "../constants";

const getEBPenalty = (args: DescriptionSeedGetterArgs) => {
  const level = args.fromSelf
    ? finalTalentLv({ talentType: "EB", char: args.char, charData: Shenhe as AppCharacter, partyData: args.partyData })
    : args.inputs[0] || 0;

  if (level) {
    const value = Math.min(5 + level, 15);
    return [level, value];
  }
  return [0, 0];
};

const Shenhe: DefaultAppCharacter = {
  code: 47,
  name: "Shenhe",
  icon: "a/af/Shenhe_Icon",
  sideIcon: "3/31/Shenhe_Side_Icon",
  rarity: 5,
  nation: "liyue",
  vision: "cryo",
  weaponType: "polearm",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  dsGetters: [(args) => `${getEBPenalty(args)[1]}%`],
  debuffs: [
    {
      index: 0,
      src: EModSrc.EB,
      description: `The field decreases opponents' {Cryo RES}#[k] and {Physical RES}#[k] by {@0}#[v].`,
      inputConfigs: [
        {
          label: "Elemental Burst Level",
          type: "level",
          for: "teammate",
        },
      ],
      applyDebuff: (obj) => {
        const [level, penalty] = getEBPenalty(obj);
        applyModifier(obj.desc + ` Lv.${level}`, obj.resistReduct, ["phys", "cryo"], penalty, obj.tracker);
      },
    },
  ],
};

export default Shenhe as AppCharacter;
