import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { TRAVELER_INFO } from "../constants";

const AnemoTraveler: DefaultAppCharacter = {
  code: 1,
  name: "Anemo Traveler",
  ...TRAVELER_INFO,
  vision: "anemo",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  }
};

export default AnemoTraveler as AppCharacter;
