import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { round, toMult } from "@Src/utils";
import { getTalentMultiplier } from "../utils";

const getESBonus = (args: DescriptionSeedGetterArgs) => {
  return getTalentMultiplier({ talentType: "ES", root: 43.2, scale: 5 }, Wriothesley as AppCharacter, args);
};

const Wriothesley: DefaultAppCharacter = {
  code: 76,
  name: "Wriothesley",
  icon: "b/bb/Wriothesley_Icon",
  sideIcon: "d/d0/Wriothesley_Side_Icon",
  rarity: 5,
  nation: "fontaine",
  vision: "cryo",
  weaponType: "catalyst",
  EBcost: 60,
  talentLvBonusAtCons: {
    NAs: 3,
    EB: 5,
  },
  dsGetters: [(args) => `${round(toMult(getESBonus(args)[1]), 3)}`],
};

export default Wriothesley as AppCharacter;
