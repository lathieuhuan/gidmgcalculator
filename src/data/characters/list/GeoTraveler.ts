import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { makeModApplier } from "@Src/utils/calculation";
import { EModSrc, TRAVELER_INFO } from "../constants";
import { checkCons } from "../utils";

const GeoTraveler: DefaultAppCharacter = {
  code: 12,
  name: "Geo Traveler",
  ...TRAVELER_INFO,
  vision: "geo",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  buffs: [
    {
      index: 0,
      src: EModSrc.C1,
      affect: EModAffect.PARTY,
      description: `Active characters within the Wake of Earth's radius have their {CRIT Rate}#[gr] increased by
      {10%}#[b,gr].`,
      isGranted: checkCons[1],
      applyBuff: makeModApplier("totalAttr", "cRate_", 10),
    },
  ],
};

export default GeoTraveler as AppCharacter;
