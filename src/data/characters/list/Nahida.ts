import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { countVision } from "@Src/utils";
import { checkCons, getTalentMultiplier } from "../utils";

function getEBBonus(args: DescriptionSeedGetterArgs) {
  let { pyro = 0 } = countVision(args.partyData);
  if (checkCons[1](args.char)) pyro++;
  const [level, mult] = getTalentMultiplier(
    { talentType: "EB", root: pyro === 1 ? 14.88 : pyro >= 2 ? 22.32 : 0 },
    Nahida as AppCharacter,
    args
  );
  return {
    level: level,
    value: mult,
    pyroCount: pyro,
  };
}

const Nahida: DefaultAppCharacter = {
  code: 62,
  name: "Nahida",
  icon: "f/f9/Nahida_Icon",
  sideIcon: "2/22/Nahida_Side_Icon",
  rarity: 5,
  nation: "sumeru",
  vision: "dendro",
  weaponType: "catalyst",
  EBcost: 50,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  dsGetters: [(args) => `${getEBBonus(args).value}%`, (args) => `${getEBBonus(args).pyroCount}`],
};

export default Nahida as AppCharacter;
