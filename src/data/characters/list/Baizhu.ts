import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Baizhu: DefaultAppCharacter = {
  code: 70,
  name: "Baizhu",
  icon: "https://images2.imgbox.com/da/d9/A4umtyus_o.png",
  sideIcon: "f/f9/Baizhu_Side_Icon",
  rarity: 5,
  nation: "liyue",
  vision: "dendro",
  weaponType: "catalyst",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
};

export default Baizhu as AppCharacter;
