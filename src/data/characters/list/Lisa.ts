import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs } from "../utils";

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
  debuffs: [
    {
      index: 0,
      src: EModSrc.A4,
      description: `Opponents hit by Lightning Rose [EB] have their {DEF}#[gr] decreased by {15%}#[b,gr] for 10s.`,
      isGranted: checkAscs[4],
      applyDebuff: makeModApplier("resistReduct", "def", 15),
    },
  ],
};

export default Lisa as AppCharacter;
