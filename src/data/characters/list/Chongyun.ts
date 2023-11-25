import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Chongyun: DefaultAppCharacter = {
  code: 4,
  name: "Chongyun",
  icon: "3/35/Chongyun_Icon",
  sideIcon: "2/20/Chongyun_Side_Icon",
  rarity: 4,
  nation: "liyue",
  vision: "cryo",
  weaponType: "claymore",
  EBcost: 40,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
};

export default Chongyun as AppCharacter;
