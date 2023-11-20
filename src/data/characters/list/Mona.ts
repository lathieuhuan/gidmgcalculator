import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Mona: DefaultAppCharacter = {
  code: 16,
  name: "Mona",
  icon: "4/41/Mona_Icon",
  sideIcon: "6/61/Mona_Side_Icon",
  rarity: 5,
  nation: "mondstadt",
  vision: "hydro",
  weaponType: "catalyst",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
};

export default Mona as AppCharacter;
