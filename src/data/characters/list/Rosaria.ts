import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Rosaria: DefaultAppCharacter = {
  code: 32,
  name: "Rosaria",
  icon: "3/35/Rosaria_Icon",
  sideIcon: "0/0e/Rosaria_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "cryo",
  weaponType: "polearm",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
};

export default Rosaria as AppCharacter;
