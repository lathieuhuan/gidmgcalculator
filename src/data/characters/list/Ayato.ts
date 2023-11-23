import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { finalTalentLv } from "@Src/utils/calculation";

const getEBBonus = (args: DescriptionSeedGetterArgs) => {
  const level = args.fromSelf
    ? finalTalentLv({ talentType: "EB", char: args.char, charData: Ayato as AppCharacter, partyData: args.partyData })
    : args.inputs[0] || 0;

  if (level) {
    const mult = Math.min(level + 10, 20);
    return [level, mult];
  }
  return [0, 0];
};

const Ayato: DefaultAppCharacter = {
  code: 50,
  name: "Ayato",
  icon: "2/27/Kamisato_Ayato_Icon",
  sideIcon: "2/2c/Kamisato_Ayato_Side_Icon",
  rarity: 5,
  nation: "inazuma",
  vision: "hydro",
  weaponType: "sword",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  dsGetters: [(args) => `${getEBBonus(args)[1]}%`],
};

export default Ayato as AppCharacter;
