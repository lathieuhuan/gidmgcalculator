import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Yanfei: DefaultAppCharacter = {
  code: 34,
  name: "Yanfei",
  icon: "5/54/Yanfei_Icon",
  sideIcon: "b/b3/Yanfei_Side_Icon",
  rarity: 4,
  nation: "liyue",
  vision: "pyro",
  weaponType: "catalyst",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
};

export default Yanfei as AppCharacter;
