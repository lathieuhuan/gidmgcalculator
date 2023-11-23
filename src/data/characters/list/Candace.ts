import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Candace: DefaultAppCharacter = {
  code: 58,
  name: "Candace",
  icon: "d/dd/Candace_Icon",
  sideIcon: "7/7f/Candace_Side_Icon",
  rarity: 4,
  nation: "sumeru",
  vision: "hydro",
  weaponType: "polearm",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
};

export default Candace as AppCharacter;
