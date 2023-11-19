import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Kaeya: DefaultAppCharacter = {
  code: 5,
  name: "Kaeya",
  icon: "b/b6/Kaeya_Icon",
  sideIcon: "b/b5/Kaeya_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "cryo",
  weaponType: "sword",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
};

export default Kaeya as AppCharacter;
