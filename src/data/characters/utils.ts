import type {
  AppCharacter,
  AttackPatternInfoKey,
  CalcItemBuff,
  CharInfo,
  DescriptionSeedGetterArgs,
  Talent,
} from "@Src/types";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { ascsFromLv } from "@Src/utils";
import { finalTalentLv } from "@Src/utils/calculation";

const makeAscsChecker = (value: number) => (char: CharInfo) => {
  return ascsFromLv(char.level) >= value;
};

const makeConsChecker = (value: number) => (char: CharInfo) => {
  return char.cons >= value;
};

export const checkAscs = {
  1: makeAscsChecker(1),
  4: makeAscsChecker(4),
};

export const checkCons = {
  1: makeConsChecker(1),
  2: makeConsChecker(2),
  4: makeConsChecker(4),
  6: makeConsChecker(6),
};

type Config = {
  talentType: Talent;
  root: number;
  scale?: number;
  inputIndex?: number;
};

export const getTalentMultiplier = (config: Config, charData: AppCharacter, args: DescriptionSeedGetterArgs) => {
  const { scale = 2, inputIndex = 0 } = config;
  const level = args.fromSelf
    ? finalTalentLv({
        talentType: config.talentType,
        char: args.char,
        charData,
        partyData: args.partyData,
      })
    : args.inputs[inputIndex] || 0;

  if (level) {
    const value = config.root * TALENT_LV_MULTIPLIERS[scale][level];
    return [level, value];
  }
  return [0, 0];
};

export const exclBuff = (
  desc: string,
  ids: string | string[],
  key: AttackPatternInfoKey,
  buffValue: number
): CalcItemBuff => {
  return {
    ids,
    bonus: {
      [key]: { desc, value: buffValue },
    },
  };
};
