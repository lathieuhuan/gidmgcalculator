import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Shenhe: DefaultAppCharacter = {
  code: 47,
  name: "Shenhe",
  icon: "a/af/Shenhe_Icon",
  sideIcon: "3/31/Shenhe_Side_Icon",
  rarity: 5,
  nation: "liyue",
  vision: "cryo",
  weaponType: "polearm",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
};

export default Shenhe as AppCharacter;
