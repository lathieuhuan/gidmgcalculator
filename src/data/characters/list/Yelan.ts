import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Yelan: DefaultAppCharacter = {
  code: 51,
  name: "Yelan",
  icon: "d/d3/Yelan_Icon",
  sideIcon: "9/9f/Yelan_Side_Icon",
  rarity: 5,
  nation: "liyue",
  vision: "hydro",
  weaponType: "bow",
  EBcost: 70,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
};

export default Yelan as AppCharacter;
