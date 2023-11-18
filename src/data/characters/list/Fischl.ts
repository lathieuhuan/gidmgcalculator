import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Fischl: DefaultAppCharacter = {
  code: 8,
  name: "Fischl",
  icon: "9/9a/Fischl_Icon",
  sideIcon: "b/b8/Fischl_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "electro",
  weaponType: "bow",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
};

export default Fischl as AppCharacter;
