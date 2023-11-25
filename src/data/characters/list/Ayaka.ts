import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Ayaka: DefaultAppCharacter = {
  code: 37,
  name: "Ayaka",
  icon: "5/51/Kamisato_Ayaka_Icon",
  sideIcon: "2/2b/Kamisato_Ayaka_Side_Icon",
  rarity: 5,
  nation: "inazuma",
  vision: "cryo",
  weaponType: "sword",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
};

export default Ayaka as AppCharacter;
