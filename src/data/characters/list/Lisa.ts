import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Lisa: DefaultAppCharacter = {
  code: 10,
  name: "Lisa",
  icon: "6/65/Lisa_Icon",
  sideIcon: "2/26/Lisa_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "electro",
  weaponType: "catalyst",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
};

export default Lisa as AppCharacter;
