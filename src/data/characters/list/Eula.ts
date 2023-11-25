import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { finalTalentLv } from "@Src/utils/calculation";

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
};

export default Eula as AppCharacter;
