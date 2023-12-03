import { BASE_REACTION_DAMAGE } from "@Src/constants";
import type {
  AppCharacter,
  ArtifactSetBonus,
  AttackElement,
  AttackElementInfoKey,
  AttackPatternBonusKey,
  AttackPatternInfoKey,
  CalcArtifacts,
  CharInfo,
  Level,
  PartyData,
  Reaction,
  ReactionBonus,
  ReactionBonusInfoKey,
  Talent
} from "@Src/types";
import { findByName } from "./pure-utils";
import { bareLv } from "./utils";

export const getArtifactSetBonuses = (artifacts: CalcArtifacts = []): ArtifactSetBonus[] => {
  const sets = [];
  const count: Record<number, number> = {};

  for (const artifact of artifacts) {
    if (artifact) {
      const { code } = artifact;
      count[code] = (count[code] || 0) + 1;

      if (count[code] === 2) {
        sets.push({ code, bonusLv: 0 });
      } else if (count[code] === 4) {
        sets[0].bonusLv = 1;
      }
    }
  }
  return sets;
};

interface TotalXtraTalentArgs {
  char: CharInfo;
  charData: AppCharacter;
  talentType: Talent;
  partyData?: PartyData;
}
export const totalXtraTalentLv = ({ char, charData, talentType, partyData }: TotalXtraTalentArgs) => {
  let result = 0;

  if (talentType === "NAs") {
    if (char.name === "Tartaglia" || (partyData && findByName(partyData, "Tartaglia"))) {
      result++;
    }
  }
  if (talentType !== "altSprint") {
    const consLv = charData.talentLvBonusAtCons?.[talentType];

    if (consLv && char.cons >= consLv) {
      result += 3;
    }
  }
  return result;
};

export const finalTalentLv = (args: TotalXtraTalentArgs) => {
  const talentLv = args.talentType === "altSprint" ? 0 : args.char[args.talentType];
  return talentLv + totalXtraTalentLv(args);
};

export type AttackPatternPath = `${AttackPatternBonusKey}.${AttackPatternInfoKey}`;

export type AttackElementPath = `${AttackElement}.${AttackElementInfoKey}`;

export type ReactionBonusPath = `${Reaction}.${ReactionBonusInfoKey}`;

export function getRxnBonusesFromEM(EM = 0) {
  return {
    transformative: Math.round((16000 * EM) / (EM + 2000)) / 10,
    amplifying: Math.round((2780 * EM) / (EM + 1400)) / 10,
    quicken: Math.round((5000 * EM) / (EM + 1200)) / 10,
    shield: Math.round((4440 * EM) / (EM + 1400)) / 10,
  };
}

export function getAmplifyingMultiplier(elmt: AttackElement, rxnBonus: ReactionBonus) {
  return {
    melt: (1 + rxnBonus.melt.pct_ / 100) * (elmt === "pyro" ? 2 : elmt === "cryo" ? 1.5 : 1),
    vaporize: (1 + rxnBonus.vaporize.pct_ / 100) * (elmt === "pyro" ? 1.5 : elmt === "hydro" ? 2 : 1),
  };
}

export function getQuickenBuffDamage(charLv: Level, rxnBonus: ReactionBonus) {
  const base = BASE_REACTION_DAMAGE[bareLv(charLv)];

  return {
    aggravate: Math.round(base * 1.15 * (1 + rxnBonus.aggravate.pct_ / 100)),
    spread: Math.round(base * 1.25 * (1 + rxnBonus.spread.pct_ / 100)),
  };
}
