import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkCons } from "../utils";

const Xinyan: DefaultAppCharacter = {
  code: 27,
  name: "Xinyan",
  icon: "2/24/Xinyan_Icon",
  sideIcon: "e/ec/Xinyan_Side_Icon",
  rarity: 4,
  nation: "liyue",
  vision: "pyro",
  weaponType: "claymore",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  debuffs: [
    {
      index: 0,
      src: EModSrc.C4,
      description: `Sweeping Fervor's swing DMG decreases opponent's {Physical RES}#[k] by {15%}#[v] for 12s.`,
      isGranted: checkCons[4],
      applyDebuff: makeModApplier("resistReduct", "phys", 15),
    },
  ],
};

export default Xinyan as AppCharacter;
