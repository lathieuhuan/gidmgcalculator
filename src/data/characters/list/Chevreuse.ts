import { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Chevreuse: DefaultAppCharacter = {
  code: 81,
  name: "Chevreuse",
  icon: "",
  sideIcon: "",
  rarity: 4,
  nation: "fontaine",
  vision: "pyro",
  weaponType: "polearm",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
};

export default Chevreuse as AppCharacter;
