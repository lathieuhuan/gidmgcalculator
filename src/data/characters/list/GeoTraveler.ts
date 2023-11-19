import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { TRAVELER_INFO } from "../constants";

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
};

export default GeoTraveler as AppCharacter;
