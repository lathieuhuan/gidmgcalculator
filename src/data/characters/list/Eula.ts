import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { applyModifier, finalTalentLv } from "@Src/utils/calculation";
import { EModSrc } from "../constants";

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
  debuffs: [
    {
      index: 0,
      src: EModSrc.ES,
      description: `If Grimheart stacks are consumed, surrounding opponents will have their {Physical RES}#[k] and
      {Cryo RES}#[k] decreased by {@0}#[v].`,
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
