import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Collei: DefaultAppCharacter = {
  code: 55,
  name: "Collei",
  icon: "a/a2/Collei_Icon",
  sideIcon: "0/04/Collei_Side_Icon",
  rarity: 4,
  nation: "sumeru",
  vision: "dendro",
  weaponType: "bow",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
};

export default Collei as AppCharacter;
