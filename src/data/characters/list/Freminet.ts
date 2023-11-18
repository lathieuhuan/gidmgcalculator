import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Freminet: DefaultAppCharacter = {
  code: 74,
  name: "Freminet",
  icon: "e/ee/Freminet_Icon",
  sideIcon: "2/21/Freminet_Side_Icon",
  rarity: 4,
  nation: "fontaine",
  vision: "cryo",
  weaponType: "claymore",
  EBcost: 60,
  talentLvBonusAtCons: {
    NAs: 3,
    ES: 5,
  }
};

export default Freminet as AppCharacter;
