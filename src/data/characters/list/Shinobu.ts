import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Shinobu: DefaultAppCharacter = {
  code: 52,
  name: "Shinobu",
  icon: "b/b3/Kuki_Shinobu_Icon",
  sideIcon: "7/7d/Kuki_Shinobu_Side_Icon",
  rarity: 4,
  nation: "inazuma",
  vision: "electro",
  weaponType: "sword",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
};

export default Shinobu as AppCharacter;
