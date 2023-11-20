import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { round, toMult } from "@Src/utils";
import { getTalentMultiplier } from "../utils";

const getESBonus = (args: DescriptionSeedGetterArgs) => {
  return getTalentMultiplier({ talentType: "ES", root: 37.91, scale: 5 }, Yoimiya as AppCharacter, args);
};

const Yoimiya: DefaultAppCharacter = {
  code: 38,
  name: "Yoimiya",
  icon: "8/88/Yoimiya_Icon",
  sideIcon: "2/2a/Yoimiya_Side_Icon",
  rarity: 5,
  nation: "inazuma",
  vision: "pyro",
  weaponType: "bow",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  dsGetters: [(args) => `${round(toMult(getESBonus(args)[1]), 3)}`],
};

export default Yoimiya as AppCharacter;
