import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Tartaglia: DefaultAppCharacter = {
  code: 26,
  name: "Tartaglia",
  icon: "8/85/Tartaglia_Icon",
  sideIcon: "2/2f/Tartaglia_Side_Icon",
  rarity: 5,
  nation: "snezhnaya",
  vision: "hydro",
  weaponType: "bow",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
};

export default Tartaglia as AppCharacter;
