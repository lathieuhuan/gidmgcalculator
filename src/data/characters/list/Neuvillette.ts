import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Neuvillette: DefaultAppCharacter = {
  code: 77,
  name: "Neuvillette",
  icon: "https://images2.imgbox.com/ae/d2/PqXhvc16_o.png",
  sideIcon: "",
  rarity: 5,
  nation: "fontaine",
  vision: "hydro",
  weaponType: "catalyst",
  EBcost: 70,
  talentLvBonusAtCons: {
    NAs: 3,
    EB: 5,
  },
};

export default Neuvillette as AppCharacter;
