import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

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
};

export default Lyney as AppCharacter;
