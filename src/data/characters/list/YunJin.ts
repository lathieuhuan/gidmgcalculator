import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { round } from "@Src/utils";
import { getTalentMultiplier } from "../utils";

const getEBBonus = (args: DescriptionSeedGetterArgs) => {
  return getTalentMultiplier({ talentType: "EB", root: 32.16, inputIndex: 1 }, YunJin as AppCharacter, args);
};

const YunJin: DefaultAppCharacter = {
  code: 48,
  name: "Yun Jin",
  icon: "9/9c/Yun_Jin_Icon",
  sideIcon: "f/fb/Yun_Jin_Side_Icon",
  rarity: 4,
  nation: "liyue",
  vision: "geo",
  weaponType: "polearm",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  dsGetters: [(args) => `${round(getEBBonus(args)[1], 2)}%`],
};

export default YunJin as AppCharacter;
