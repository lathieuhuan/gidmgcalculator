import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { round } from "@Src/utils";
import { getTalentMultiplier } from "../utils";

const getCoilStackBuffValue = (args: DescriptionSeedGetterArgs) => {
  const [, mult] = getTalentMultiplier({ root: 5.846, talentType: "ES", scale: 5 }, Aloy as AppCharacter, args);
  let stacks = args.inputs[0] || 0;
  stacks = stacks === 4 ? 5 : stacks;
  return mult * stacks;
};

const Aloy: DefaultAppCharacter = {
  code: 39,
  name: "Aloy",
  icon: "e/e5/Aloy_Icon",
  sideIcon: "4/46/Aloy_Side_Icon",
  rarity: 5,
  nation: "outland",
  vision: "cryo",
  weaponType: "bow",
  EBcost: 40,
  dsGetters: [(args) => `${round(getCoilStackBuffValue(args), 3)}%`],
};

export default Aloy as AppCharacter;
