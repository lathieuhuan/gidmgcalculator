import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { TRAVELER_INFO } from "../constants";

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
};

export default ElectroTraveler as AppCharacter;
