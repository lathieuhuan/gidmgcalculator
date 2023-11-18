import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Dori: DefaultAppCharacter = {
  code: 56,
  name: "Dori",
  icon: "5/54/Dori_Icon",
  sideIcon: "6/6d/Dori_Side_Icon",
  rarity: 4,
  nation: "sumeru",
  vision: "electro",
  weaponType: "claymore",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
};

export default Dori as AppCharacter;
