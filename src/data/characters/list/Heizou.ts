import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Heizou: DefaultAppCharacter = {
  code: 53,
  name: "Heizou",
  icon: "2/20/Shikanoin_Heizou_Icon",
  sideIcon: "c/ca/Shikanoin_Heizou_Side_Icon",
  rarity: 4,
  nation: "inazuma",
  vision: "anemo",
  weaponType: "catalyst",
  EBcost: 40,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
};

export default Heizou as AppCharacter;
