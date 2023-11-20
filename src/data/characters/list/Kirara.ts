import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Kirara: DefaultAppCharacter = {
  code: 71,
  name: "Kirara",
  icon: "https://images2.imgbox.com/4c/09/DLJYSuy8_o.png",
  sideIcon: "1/1b/Kirara_Side_Icon",
  rarity: 4,
  nation: "inazuma",
  vision: "dendro",
  weaponType: "sword",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
};

export default Kirara as AppCharacter;
