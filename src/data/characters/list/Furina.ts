import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { finalTalentLv } from "@Src/utils/calculation";

const getEBBonus = (args: DescriptionSeedGetterArgs) => {
  const level = args.fromSelf
    ? finalTalentLv({ ...args, charData: Furina as AppCharacter, talentType: "EB" })
    : args.inputs[1];
  return {
    level,
    dmgBonusPerS: (5 + level * 2) / 100,
    inHealBonusPerS: level / 100,
  };
};

const Furina: DefaultAppCharacter = {
  code: 78,
  name: "Furina",
  icon: "e/e6/Furina_Icon",
  sideIcon: "0/0d/Furina_Side_Icon",
  rarity: 5,
  nation: "fontaine",
  vision: "hydro",
  weaponType: "sword",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  dsGetters: [(args) => `${getEBBonus(args).dmgBonusPerS}%`],
  
};

export default Furina as AppCharacter;
