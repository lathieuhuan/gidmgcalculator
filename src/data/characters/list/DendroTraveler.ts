import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { TRAVELER_INFO } from "../constants";

const DendroTraveler: DefaultAppCharacter = {
  code: 57,
  name: "Dendro Traveler",
  ...TRAVELER_INFO,
  vision: "dendro",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
};

export default DendroTraveler as AppCharacter;
