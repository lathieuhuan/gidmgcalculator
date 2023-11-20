import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const KujouSara: DefaultAppCharacter = {
  code: 41,
  name: "Kujou Sara",
  icon: "d/df/Kujou_Sara_Icon",
  sideIcon: "0/00/Kujou_Sara_Side_Icon",
  rarity: 4,
  nation: "inazuma",
  vision: "electro",
  weaponType: "bow",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
};

export default KujouSara as AppCharacter;
