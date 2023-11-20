import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Kokomi: DefaultAppCharacter = {
  code: 42,
  name: "Kokomi",
  icon: "f/ff/Sangonomiya_Kokomi_Icon",
  sideIcon: "c/c1/Sangonomiya_Kokomi_Side_Icon",
  rarity: 5,
  nation: "inazuma",
  vision: "hydro",
  weaponType: "catalyst",
  EBcost: 70,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
};

export default Kokomi as AppCharacter;
