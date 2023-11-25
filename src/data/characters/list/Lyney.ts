import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { round } from "@Src/utils";
import { getTalentMultiplier } from "../utils";

const getPropSurplusValue = (args: DescriptionSeedGetterArgs) => {
  return getTalentMultiplier({ talentType: "ES", root: 53.2 }, Lyney as AppCharacter, args);
};

const Lyney: DefaultAppCharacter = {
  code: 73,
  name: "Lyney",
  icon: "b/b2/Lyney_Icon",
  sideIcon: "6/6a/Lyney_Side_Icon",
  rarity: 5,
  nation: "fontaine",
  vision: "pyro",
  weaponType: "bow",
  EBcost: 60,
  talentLvBonusAtCons: {
    NAs: 3,
    EB: 5,
  },
  dsGetters: [(args) => `${round(getPropSurplusValue(args)[1], 2)}%`],
};

export default Lyney as AppCharacter;
