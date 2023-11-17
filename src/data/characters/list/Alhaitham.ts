import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Alhaitham: DefaultAppCharacter = {
  code: 65,
  name: "Alhaitham",
  icon: "2/2c/Alhaitham_Icon",
  sideIcon: "c/cb/Alhaitham_Side_Icon",
  rarity: 5,
  nation: "sumeru",
  vision: "dendro",
  weaponType: "sword",
  EBcost: 70,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
};

export default Alhaitham as AppCharacter;
