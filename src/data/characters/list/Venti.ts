import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Venti: DefaultAppCharacter = {
  code: 22,
  name: "Venti",
  icon: "f/f1/Venti_Icon",
  sideIcon: "0/00/Venti_Side_Icon",
  rarity: 5,
  nation: "mondstadt",
  vision: "anemo",
  weaponType: "bow",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
};

export default Venti as AppCharacter;
