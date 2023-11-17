import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkCons } from "../utils";

const Ayaka: DefaultAppCharacter = {
  code: 37,
  name: "Ayaka",
  icon: "5/51/Kamisato_Ayaka_Icon",
  sideIcon: "2/2b/Kamisato_Ayaka_Side_Icon",
  rarity: 5,
  nation: "inazuma",
  vision: "cryo",
  weaponType: "sword",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  debuffs: [
    {
      index: 0,
      src: EModSrc.C4,
      description: `Opponents damaged by Frostflake Seki no To [~EB] will have their {DEF}#[k] decreased by
      {30%}#[v] for 6s.`,
      isGranted: checkCons[4],
      applyDebuff: makeModApplier("resistReduct", "def", 30),
    },
  ],
};

export default Ayaka as AppCharacter;
