import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Itto: DefaultAppCharacter = {
  code: 45,
  name: "Itto",
  icon: "7/7b/Arataki_Itto_Icon",
  sideIcon: "c/c8/Arataki_Itto_Side_Icon",
  rarity: 5,
  nation: "inazuma",
  vision: "geo",
  weaponType: "claymore",
  EBcost: 70,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
};

export default Itto as AppCharacter;
