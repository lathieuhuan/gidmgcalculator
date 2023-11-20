import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { round } from "@Src/utils";
import { getTalentMultiplier } from "../utils";

const getEBBonus = (args: DescriptionSeedGetterArgs) => {
  return getTalentMultiplier({ talentType: "EB", root: 58.45 }, Xiao as AppCharacter, args);
};

const Xiao: DefaultAppCharacter = {
  code: 30,
  name: "Xiao",
  icon: "f/fd/Xiao_Icon",
  sideIcon: "4/49/Xiao_Side_Icon",
  rarity: 5,
  nation: "liyue",
  vision: "anemo",
  weaponType: "polearm",
  EBcost: 70,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  dsGetters: [(args) => `${round(getEBBonus(args)[1], 2)}%`],
};

export default Xiao as AppCharacter;
