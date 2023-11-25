import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Jean: DefaultAppCharacter = {
  code: 2,
  name: "Jean",
  icon: "6/64/Jean_Icon",
  sideIcon: "b/b2/Jean_Side_Icon",
  rarity: 5,
  nation: "mondstadt",
  vision: "anemo",
  weaponType: "sword",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
};

export default Jean as AppCharacter;
