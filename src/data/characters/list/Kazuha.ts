import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Kazuha: DefaultAppCharacter = {
  code: 35,
  name: "Kazuha",
  icon: "e/e3/Kaedehara_Kazuha_Icon",
  sideIcon: "c/cc/Kaedehara_Kazuha_Side_Icon",
  rarity: 5,
  nation: "inazuma",
  vision: "anemo",
  weaponType: "sword",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
};

export default Kazuha as AppCharacter;
