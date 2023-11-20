import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Tighnari: DefaultAppCharacter = {
  code: 54,
  name: "Tighnari",
  icon: "8/87/Tighnari_Icon",
  sideIcon: "1/15/Tighnari_Side_Icon",
  rarity: 5,
  nation: "sumeru",
  vision: "dendro",
  weaponType: "bow",
  EBcost: 40,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
};

export default Tighnari as AppCharacter;
