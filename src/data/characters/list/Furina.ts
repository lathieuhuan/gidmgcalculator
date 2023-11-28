import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

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
};

export default Furina as AppCharacter;
