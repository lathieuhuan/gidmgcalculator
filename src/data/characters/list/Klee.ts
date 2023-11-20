import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkCons } from "../utils";

const Klee: DefaultAppCharacter = {
  code: 23,
  name: "Klee",
  icon: "9/9c/Klee_Icon",
  sideIcon: "b/ba/Klee_Side_Icon",
  rarity: 5,
  nation: "mondstadt",
  vision: "pyro",
  weaponType: "catalyst",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  debuffs: [
    {
      index: 0,
      src: EModSrc.C2,
      description: `On hit, Jumpy Dumpty's [ES] mines decreases opponents' {DEF}#[k] by {23%}#[v] for 10s.`,
      isGranted: checkCons[2],
      applyDebuff: makeModApplier("resistReduct", "def", 23),
    },
  ],
};

export default Klee as AppCharacter;
