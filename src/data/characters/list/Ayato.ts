import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Ayato: DefaultAppCharacter = {
  code: 50,
  name: "Ayato",
  icon: "2/27/Kamisato_Ayato_Icon",
  sideIcon: "2/2c/Kamisato_Ayato_Side_Icon",
  rarity: 5,
  nation: "inazuma",
  vision: "hydro",
  weaponType: "sword",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
};

export default Ayato as AppCharacter;
