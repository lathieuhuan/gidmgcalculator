import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { TRAVELER_INFO } from "../constants";

const HydroTraveler: DefaultAppCharacter = {
  code: 75,
  name: "Hydro Traveler",
  ...TRAVELER_INFO,
  vision: "hydro",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
};

export default HydroTraveler as AppCharacter;
