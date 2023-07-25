import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { Green } from "@Src/pure-components";
import { makeModApplier } from "@Src/utils/calculation";
import { EModSrc, TRAVELER_INFO } from "../constants";
import { checkCons } from "../utils";

const GeoMC: DefaultAppCharacter = {
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
      desc: () => (
        <>
          Party members within the radius of Wake of Earth have their <Green>CRIT Rate</Green> increased by{" "}
          <Green b>10%</Green> and have increased resistance against interruption.
        </>
      ),
      isGranted: checkCons[1],
      applyBuff: makeModApplier("totalAttr", "cRate_", 10),
    },
  ],
};

export default GeoMC as AppCharacter;
