import type { AppCharacter, CharInfo, DefaultAppCharacter, PartyData } from "@Src/types";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { round, toMult } from "@Src/utils";
import { finalTalentLv } from "@Src/utils/calculation";

const getESBonus = (char: CharInfo, partyData: PartyData) => {
  const level = finalTalentLv({
    talentType: "ES",
    char,
    charData: Wanderer as AppCharacter,
    partyData,
  });
  return {
    NA: 32.98 * TALENT_LV_MULTIPLIERS[5][level],
    CA: 26.39 * TALENT_LV_MULTIPLIERS[5][level],
  };
};

const Wanderer: DefaultAppCharacter = {
  code: 63,
  name: "Wanderer",
  icon: "f/f8/Wanderer_Icon",
  sideIcon: "6/67/Wanderer_Side_Icon",
  rarity: 5,
  nation: "sumeru",
  vision: "anemo",
  weaponType: "catalyst",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  dsGetters: [
    (args) => `${round(toMult(getESBonus(args.char, args.partyData).NA), 3)}`,
    (args) => `${round(toMult(getESBonus(args.char, args.partyData).CA), 3)}`,
  ],
};

export default Wanderer as AppCharacter;
