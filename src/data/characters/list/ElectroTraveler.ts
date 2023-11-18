import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { makeModApplier } from "@Src/utils/calculation";
import { EModSrc, TRAVELER_INFO } from "../constants";
import { checkCons } from "../utils";

const ElectroTraveler: DefaultAppCharacter = {
  code: 46,
  name: "Electro Traveler",
  ...TRAVELER_INFO,
  vision: "electro",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  debuffs: [
    {
      index: 0,
      src: EModSrc.C2,
      description: `When Falling Thunder [~EB] hits an opponent, it will decrease their {Electro RES}#[k] by
      {15%}#[v] for 8s.`,
      isGranted: checkCons[2],
      applyDebuff: makeModApplier("resistReduct", "electro", 15),
    },
  ],
};

export default ElectroTraveler as AppCharacter;
