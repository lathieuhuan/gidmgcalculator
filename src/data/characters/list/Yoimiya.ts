import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Yoimiya: DefaultAppCharacter = {
  code: 38,
  name: "Yoimiya",
  icon: "8/88/Yoimiya_Icon",
  sideIcon: "2/2a/Yoimiya_Side_Icon",
  rarity: 5,
  nation: "inazuma",
  vision: "pyro",
  weaponType: "bow",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
};

export default Yoimiya as AppCharacter;
