import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Sucrose: DefaultAppCharacter = {
  code: 3,
  name: "Sucrose",
  icon: "0/0e/Sucrose_Icon",
  sideIcon: "9/98/Sucrose_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "anemo",
  weaponType: "catalyst",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
};

export default Sucrose as AppCharacter;
