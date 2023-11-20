import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { finalTalentLv } from "@Src/utils/calculation";

const getESBonus = ({ fromSelf, char, partyData, inputs }: DescriptionSeedGetterArgs) => {
  const level = fromSelf
    ? finalTalentLv({ talentType: "ES", char: char, charData: Mika as AppCharacter, partyData })
    : inputs[0] || 0;
  return level ? Math.min(12 + level, 25) : 0;
};

const Mika: DefaultAppCharacter = {
  code: 67,
  name: "Mika",
  icon: "d/dd/Mika_Icon",
  sideIcon: "8/84/Mika_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "cryo",
  weaponType: "polearm",
  EBcost: 70,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  dsGetters: [(args) => `${getESBonus(args)}%`],
};

export default Mika as AppCharacter;
