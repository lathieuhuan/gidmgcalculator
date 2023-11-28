import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Razor: DefaultAppCharacter = {
  code: 11,
  name: "Razor",
  icon: "b/b8/Razor_Icon",
  sideIcon: "4/4d/Razor_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "electro",
  weaponType: "claymore",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
};

export default Razor as AppCharacter;
