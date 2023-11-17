import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Amber: DefaultAppCharacter = {
  code: 18,
  name: "Amber",
  icon: "7/75/Amber_Icon",
  sideIcon: "0/07/Amber_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "pyro",
  weaponType: "bow",
  EBcost: 40,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
};

export default Amber as AppCharacter;
