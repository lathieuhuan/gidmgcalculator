import { BASE_REACTION_DAMAGE } from "@Src/constants";
import type {
  ArtifactSetBonus,
  AttackElement,
  AttackElementBonus,
  AttackElementInfoKey,
  AttackPatternBonus,
  AttackPatternBonusKey,
  AttackPatternInfoKey,
  AttributeStat,
  CalcArtifacts,
  CharInfo,
  DataCharacter,
  Level,
  PartyData,
  Reaction,
  ReactionBonus,
  ReactionBonusInfoKey,
  ResistanceReduction,
  ResistanceReductionKey,
  Talent,
  TotalAttribute,
  Tracker,
} from "@Src/types";
import { findByName, pickOne, turnArray } from "./pure-utils";
import { bareLv } from "./utils";

export function getArtifactSetBonuses(artifacts: CalcArtifacts = []): ArtifactSetBonus[] {
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
}

interface TotalXtraTalentArgs {
  char: CharInfo;
  dataChar: DataCharacter;
  talentType: Talent;
  partyData?: PartyData;
}
export function totalXtraTalentLv({ char, dataChar, talentType, partyData }: TotalXtraTalentArgs) {
  let result = 0;
  const [atCons3, atCons5] = dataChar.bonusLvFromCons;

  if (talentType === "NAs") {
    if (char.name === "Tartaglia" || (partyData && findByName(partyData, "Tartaglia"))) {
      result++;
    }
  }

  const increaseByCons = (atCons: typeof talentType) => {
    if (talentType === atCons) {
      result += 3;
    }
  };

  if (char.cons >= 3) {
    increaseByCons(atCons3);
  }
  if (char.cons >= 5) {
    increaseByCons(atCons5);
  }

  return result;
}

export const finalTalentLv = (args: TotalXtraTalentArgs) => {
  const talentLv = args.talentType === "altSprint" ? 0 : args.char[args.talentType];
  return talentLv + totalXtraTalentLv(args);
};

export type AttackPatternPath = `${AttackPatternBonusKey}.${AttackPatternInfoKey}`;

export type AttackElementPath = `${AttackElement}.${AttackElementInfoKey}`;

export type ReactionBonusPath = `${Reaction}.${ReactionBonusInfoKey}`;

export type ModRecipient =
  | TotalAttribute
  | ReactionBonus
  | AttackPatternBonus
  | AttackElementBonus
  | ResistanceReduction;

export type ModRecipientKey =
  | AttributeStat
  | AttributeStat[]
  | ReactionBonusPath
  | ReactionBonusPath[]
  | AttackPatternPath
  | AttackPatternPath[]
  | AttackElementPath
  | AttackElementPath[]
  | ResistanceReductionKey
  | ResistanceReductionKey[];

type RootValue = number | number[];

export function applyModifier(
  desc: string | undefined,
  recipient: TotalAttribute,
  keys: AttributeStat | AttributeStat[],
  rootValue: RootValue,
  tracker?: Tracker
): void;
export function applyModifier(
  desc: string | undefined,
  recipient: AttackPatternBonus,
  keys: AttackPatternPath | AttackPatternPath[],
  rootValue: RootValue,
  tracker?: Tracker
): void;
export function applyModifier(
  desc: string | undefined,
  recipient: AttackElementBonus,
  keys: AttackElementPath | AttackElementPath[],
  rootValue: RootValue,
  tracker?: Tracker
): void;
export function applyModifier(
  desc: string | undefined,
  recipient: ReactionBonus,
  keys: ReactionBonusPath | ReactionBonusPath[],
  rootValue: RootValue,
  tracker?: Tracker
): void;
export function applyModifier(
  desc: string | undefined,
  recipient: ResistanceReduction,
  keys: ResistanceReductionKey | ResistanceReductionKey[],
  rootValue: RootValue,
  tracker?: Tracker
): void;

export function applyModifier(
  desc: string | undefined = "",
  recipient: ModRecipient,
  keys: ModRecipientKey,
  rootValue: RootValue,
  tracker?: Tracker
) {
  const keyOfTracker = (): keyof Tracker => {
    if ("atk" in recipient) {
      return "totalAttr";
    } else if ("all" in recipient) {
      return "attPattBonus";
    } else if ("bloom" in recipient) {
      return "rxnBonus";
    } else if ("def" in recipient) {
      return "resistReduct";
    } else {
      return "attElmtBonus";
    }
  };

  turnArray(keys).forEach((key, i) => {
    const [field, subField] = key.split(".");
    const value = pickOne(rootValue, i);
    const node = {
      desc,
      value,
    };
    // recipient: TotalAttribute, ReactionBonus, ResistanceReduction
    if (subField === undefined) {
      (recipient as any)[field] += value;
      if (tracker) {
        (tracker as any)[keyOfTracker()][field].push(node);
      }
    } else {
      (recipient as any)[field][subField] += value;
      if (tracker) {
        (tracker as any)[keyOfTracker()][key].push(node);
      }
    }
  });
}

export type RecipientName = "totalAttr" | "attPattBonus" | "attElmtBonus" | "rxnBonus" | "resistReduct";

interface ModApplierArgs {
  totalAttr: TotalAttribute;
  attPattBonus: AttackPatternBonus;
  rxnBonus: ReactionBonus;
  desc: string;
  tracker: Tracker;
}

export function makeModApplier(
  recipientName: "totalAttr",
  keys: AttributeStat | AttributeStat[],
  rootValue: RootValue
): (args: any) => void;
export function makeModApplier(
  recipientName: "attPattBonus",
  keys: AttackPatternPath | AttackPatternPath[],
  rootValue: RootValue
): (args: any) => void;
export function makeModApplier(
  recipientName: "attElmtBonus",
  keys: AttackElementPath | AttackElementPath[],
  rootValue: RootValue
): (args: any) => void;
export function makeModApplier(
  recipientName: "rxnBonus",
  keys: ReactionBonusPath | ReactionBonusPath[],
  rootValue: RootValue
): (args: any) => void;
export function makeModApplier(
  recipientName: "resistReduct",
  keys: ResistanceReductionKey | ResistanceReductionKey[],
  rootValue: RootValue
): (args: any) => void;

export function makeModApplier(recipientName: RecipientName, keys: ModRecipientKey, rootValue: RootValue) {
  return (args: ModApplierArgs) => {
    const recipient = (args as any)[recipientName];
    if (recipient) {
      applyModifier(args.desc, recipient, keys as any, rootValue, args.tracker);
    }
  };
}

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
