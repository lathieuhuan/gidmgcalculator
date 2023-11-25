import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Ganyu: DefaultAppCharacter = {
  code: 28,
  name: "Ganyu",
  icon: "7/79/Ganyu_Icon",
  sideIcon: "3/3a/Ganyu_Side_Icon",
  rarity: 5,
  nation: "liyue",
  vision: "cryo",
  weaponType: "bow",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
};

export default Ganyu as AppCharacter;
