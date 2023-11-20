import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Lynette: DefaultAppCharacter = {
  code: 72,
  name: "Lynette",
  icon: "a/ad/Lynette_Icon",
  sideIcon: "1/16/Lynette_Side_Icon",
  rarity: 4,
  nation: "fontaine",
  vision: "anemo",
  weaponType: "sword",
  EBcost: 70,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
};

export default Lynette as AppCharacter;
