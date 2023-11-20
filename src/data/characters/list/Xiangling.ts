import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkCons } from "../utils";

const Xiangling: DefaultAppCharacter = {
  code: 21,
  name: "Xiangling",
  icon: "3/39/Xiangling_Icon",
  sideIcon: "b/b0/Xiangling_Side_Icon",
  rarity: 4,
  nation: "liyue",
  vision: "pyro",
  weaponType: "polearm",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  debuffs: [
    {
      index: 0,
      src: EModSrc.C1,
      description: `Opponents hit by Guoba's attacks have their {Pyro RES}#[k] reduced by {15%}#[v] for 6s.`,
      isGranted: checkCons[1],
      applyDebuff: makeModApplier("resistReduct", "pyro", 15),
    },
  ],
};

export default Xiangling as AppCharacter;
