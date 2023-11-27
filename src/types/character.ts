import { EModAffect } from "@Src/constants";
import type { AttackElementPath, AttackPatternPath, ReactionBonusPath } from "@Src/utils/calculation";
import type { AttackPatternInfoKey, ModifierInput, PartyData, ResistanceReductionKey, Talent } from "./calculator";
import type {
  AttackElement,
  AttackPattern,
  AttributeStat,
  CharInfo,
  ModInputConfig,
  Nation,
  Rarity,
  Vision,
  WeaponType,
} from "./global";

export type DefaultAppCharacter = Pick<
  AppCharacter,
  | "code"
  | "name"
  | "icon"
  | "sideIcon"
  | "rarity"
  | "nation"
  | "vision"
  | "weaponType"
  | "EBcost"
  | "talentLvBonusAtCons"
  | "dsGetters"
>;

export type AppCharacter = {
  code: number;
  name: string;
  beta?: boolean;
  GOOD?: string;
  icon: string;
  sideIcon: string;
  rarity: Rarity;
  nation: Nation;
  vision: Vision;
  weaponType: WeaponType;
  EBcost: number;
  talentLvBonusAtCons?: Partial<Record<Talent, number>>;
  stats: number[][];
  bonusStat: {
    type: AttributeStat;
    value: number;
  };
  calcListConfig?: {
    NA?: CalcListConfig;
    CA?: CalcListConfig;
    PA?: CalcListConfig;
    ES?: CalcListConfig;
    EB?: CalcListConfig;
  };
  calcList: {
    NA: CalcItem[];
    CA: CalcItem[];
    PA: CalcItem[];
    ES: CalcItem[];
    EB: CalcItem[];
  };
  activeTalents: {
    NAs: Ability;
    ES: Ability;
    EB: Ability;
    altSprint?: Ability;
  };
  passiveTalents: Ability[];
  constellation: Ability[];
  /** ds: description seed */
  dsGetters?: DescriptionSeedGetter[];
  innateBuffs?: AbilityInnateBuff[];
  buffs?: AbilityBuff[];
  debuffs?: AbilityDebuff[];
};

export type DescriptionSeedGetterArgs = {
  char: CharInfo;
  partyData: PartyData;
  inputs: ModifierInput[];
  fromSelf: boolean;
};

export type DescriptionSeedGetter = (args: DescriptionSeedGetterArgs) => string;

export type TalentAttributeType = "base_atk" | "atk" | "def" | "hp" | "em";

type CalcListConfig = {
  multScale?: number;
  multAttributeType?: TalentAttributeType;
};

type Ability = {
  name: string;
  image?: string;
  description?: string;
};

export type ActualAttackPattern = AttackPattern | "none";

export type ActualAttackElement = AttackElement | "absorb";

type CalcItemMultFactor = {
  root: number;
  /** When 0 stat not scale off talent level */
  scale?: number;
  /** Calc default to 'atk'. Only on ES / EB */
  attributeType?: TalentAttributeType;
};

export type CalcItemType = "attack" | "healing" | "shield" | "other";

export type CalcItem = {
  id?: string;
  name: string;
  type?: CalcItemType;
  notOfficial?: boolean;
  attPatt?: ActualAttackPattern;
  attElmt?: ActualAttackElement;
  subAttPatt?: "FCA";
  /**
   * Damage factors multiplying an attribute, scaling off talent level
   */
  multFactors: number | number[] | CalcItemMultFactor | CalcItemMultFactor[];
  multFactorsAreOne?: boolean;
  /**
   * Damage factor multiplying root, caling off talent level. Only on ES / EB
   */
  flatFactor?:
    | number
    | {
        root: number;
        /**
         * Calc default to getTalentDefaultInfo's return.flatFactorScale.
         * When 0 not scale off talent level.
         */
        scale?: number;
      };
};

// ============ MODIFIERS COMMON ============

export type CharacterMilestone = "A1" | "A4" | "C1" | "C2" | "C4" | "C6";

type AbilityModifier = {
  src: string;
  grantedAt?: CharacterMilestone;
  description: string;
};

export type AbilityEffectAvailableCondition = {
  grantedAt?: CharacterMilestone;
  /** When this bonus is from teammate, this is input's index to check granted. */
  alterIndex?: number;
};

type InputCheck = {
  value: number;
  /** Default to 0 */
  index?: number;
  /** Default to 'equal' */
  type?: "equal" | "min" | "max" | "included";
};

export type AbilityEffectApplyCondition = {
  checkInput?: number | InputCheck;
  /** On Chongyun */
  forWeapons?: WeaponType[];
  /** On Chevreuse */
  forElmts?: Vision[];
  /** On Gorou, Nilou, Chevreuse */
  partyElmtCount?: Partial<Record<Vision, number>>;
  /** On Nilou, Chevreuse */
  partyOnlyElmts?: Vision[];
};

export type AbilityEffectLevelScale = {
  talent: Talent;
  /** If [value] = 0: buff value * level. Otherwise buff value * TALENT_LV_MULTIPLIERS[value][level]. */
  value: number;
  /** When this bonus is from teammate, this is input's index to get level. Default to 0 */
  alterIndex?: number;
};

// ============ BUFFS ============

export type DynamicMax = {
  value: number;
  extras: Array<{
    grantedAt?: CharacterMilestone;
    checkInput?: InputCheck;
    value: number;
  }>;
};

type InputStack = {
  type: "input";
  /** Default to 0 */
  index?: number;
  /** When this bonus is from teammate, this is input's index to get stacks. */
  alterIndex?: number;
};

type AttributeStack = {
  type: "attribute";
  field: "base_atk" | "hp" | "atk" | "def" | "em" | "er_" | "healB_";
  /** When this bonus is from teammate, this is input's index to get value. Default to 0 */
  alterIndex?: number;
};

type NationStack = {
  /** On Charlotte */
  type: "nation";
  nation: "same" | "different";
};

/** On Raiden Shogun */
type EnergyStack = {
  type: "energy";
};

/** On Raiden Shogun */
type ResolveStack = {
  type: "resolve";
};

export type AbilityBonusStack = (InputStack | AttributeStack | NationStack | EnergyStack | ResolveStack) & {
  /** Final stack = stack - required base */
  requiredBase?: number;
  /** On Furina */
  extra?: AbilityEffectAvailableCondition & {
    value: number;
  };
  /** Dynamic on Mika */
  max?: number | DynamicMax;
};

export type AbilityBonusTarget =
  | {
      /** totalAttr */
      type: "ATTR";
      path: AttributeStat | AttributeStat[];
    }
  | {
      /** attPattBonus */
      type: "PATT";
      path: AttackPatternPath | AttackPatternPath[];
    }
  | {
      /** attElmtBonus */
      type: "ELMT";
      path: AttackElementPath | AttackElementPath[];
    }
  | {
      /** rxnBonus */
      type: "RXN";
      path: ReactionBonusPath | ReactionBonusPath[];
    }
  | {
      /** calcItem */
      type: "ITEM";
      id: string | string[];
      path: AttackPatternInfoKey;
    }
  | {
      /** On Dendro Traveler, Kazuha, Sucrose */
      type: "IN_ELMT";
      /** Input's index to get element's index. Default to 0 */
      index?: number;
    }
  | {
      /** On Candace */
      type: "ELM_NA";
    };

type ValueOption = {
  /** On Navia */
  preOptions?: number[];
  options: number[];
  indexSrc:
    | {
        type: "vision";
        visionType: "various" | Vision | Vision[];
      }
    | {
        /** On Neuvillette */
        type: "input";
        index?: number;
      }
    | {
        /** On Razor */
        type: "level";
        talent: Talent;
      };
  /** Add to indexSrc. On Nahida */
  extra?: AbilityEffectAvailableCondition & {
    value: number;
  };
  /** Max index. Dynamic on Navia */
  max?: number | DynamicMax;
};

export interface AbilityBonus extends AbilityEffectAvailableCondition, AbilityEffectApplyCondition {
  value: number | ValueOption;
  /** Multiplier based on talent level */
  scale?: AbilityEffectLevelScale;
  /** Added before stacks, after scale */
  preExtra?: number | Omit<AbilityBonus, "targets">;
  /** Index of pre-calculated stack */
  stackIndex?: number;
  stacks?: AbilityBonusStack | AbilityBonusStack[];
  targets: AbilityBonusTarget | AbilityBonusTarget[];
  max?:
    | number
    | {
        /** On Hu Tao */
        value: number;
        stacks: AbilityBonusStack;
      };
}

type AbilityParentBonus = {
  stacks: AbilityBonusStack | AbilityBonusStack[];
  children: AbilityBonus[];
};

export type AbilityBonusModel = AbilityParentBonus | AbilityBonus;

export type AbilityInnateBuff = AbilityModifier & {
  bonusModels?: AbilityBonusModel | AbilityBonusModel[];
};

export type AbilityBuff = AbilityInnateBuff & {
  /** This is id */
  index: number;
  affect: EModAffect;
  inputConfigs?: ModInputConfig[];
  infuseConfig?: {
    overwritable: boolean;
    range?: ("NA" | "CA" | "PA")[];
    disabledNAs?: boolean;
  };
};

// ============ DEBUFFS ============

type PenaltyTarget =
  | ResistanceReductionKey
  | {
      type: "in_elmt";
      /** Input's index to get Vision index. Default to 0 */
      index?: number;
    };

export interface AbilityPenaltyModel extends AbilityEffectAvailableCondition, AbilityEffectApplyCondition {
  value: number;
  scale?: AbilityEffectLevelScale;
  /** Added before stacks, after scale */
  preExtra?:
    | number
    | {
        /** index is 0 */
        checkInput: number;
        /** On Venti */
        value: number;
      };
  targets: PenaltyTarget | PenaltyTarget[];
  index?: number;
  max?: number;
}

export type AbilityDebuff = AbilityModifier & {
  /** This is id */
  index: number;
  affect?: EModAffect;
  inputConfigs?: ModInputConfig[];
  penaltyModels?: AbilityPenaltyModel;
};
