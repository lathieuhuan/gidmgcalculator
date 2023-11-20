import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Ningguang: DefaultAppCharacter = {
  code: 13,
  name: "Ningguang",
  icon: "e/e0/Ningguang_Icon",
  sideIcon: "2/25/Ningguang_Side_Icon",
  rarity: 4,
  nation: "liyue",
  vision: "geo",
  weaponType: "catalyst",
  EBcost: 40,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
};

export default Ningguang as AppCharacter;
