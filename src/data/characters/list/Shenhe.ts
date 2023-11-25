import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { finalTalentLv } from "@Src/utils/calculation";

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
};

export default Shenhe as AppCharacter;
