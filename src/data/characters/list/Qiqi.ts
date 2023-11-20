import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Qiqi: DefaultAppCharacter = {
  code: 7,
  name: "Qiqi",
  icon: "b/b3/Qiqi_Icon",
  sideIcon: "e/ef/Qiqi_Side_Icon",
  rarity: 5,
  nation: "liyue",
  vision: "cryo",
  weaponType: "sword",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
};

export default Qiqi as AppCharacter;
