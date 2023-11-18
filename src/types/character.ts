import type {
  AttackElement,
  AttackPattern,
  Vision,
  Nation,
  Rarity,
  WeaponType,
  CharInfo,
  NormalAttack,
  ModInputConfig,
  AttributeStat,
} from "./global";
import type {
  ModifierCtrl,
  ModifierInput,
  BuffModifierArgsWrapper,
  Talent,
  DebuffModifierArgsWrapper,
  AttackPatternInfoKey,
} from "./calculator";
import { EModAffect } from "@Src/constants";
import { AttackElementPath, AttackPatternPath, ReactionBonusPath } from "@Src/utils/calculation";

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
  | "innateBuffs"
  | "buffs"
  | "debuffs"
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
  innateBuffs?: CharacterInnateBuff[];
  // buffs?: AbilityBuff[];
  buffs?: CharacterBuff[];
  debuffs?: AbilityDebuff[];
};

export type DescriptionSeedGetterArgs = Pick<ApplyCharBuffArgs, "fromSelf" | "char" | "partyData" | "inputs">;

export type DescriptionSeedGetter = (args: DescriptionSeedGetterArgs) => string;

type CalcListConfig = {
  multScale?: number;
  multAttributeType?: TalentAttributeType;
};

type Ability = {
  name: string;
  image?: string;
  description?: string;
};

export type TalentAttributeType = "base_atk" | "atk" | "def" | "hp" | "em";

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
        /** Calc default to getTalentDefaultInfo's return.flatFactorScale.
         * When 0 not scale off talent level.
         */
        scale?: number;
      };
};

// ============ BUFFS ============
export type BuffDescriptionArgs = Pick<
  ApplyCharBuffArgs,
  "fromSelf" | "char" | "charData" | "charBuffCtrls" | "partyData" | "totalAttr" | "inputs"
>;

type ApplyCharInnateBuffArgs = BuffModifierArgsWrapper & {
  charBuffCtrls: ModifierCtrl[];
  desc: string;
};

// export type InnateBuff = {
//   src: string;
//   isGranted: (char: CharInfo) => boolean;
//   description: number | string;
//   applyBuff?: (args: ApplyCharInnateBuffArgs) => void;
//   applyFinalBuff?: (args: ApplyCharInnateBuffArgs) => void;
// };

type AbilityModifier = {
  /** This is id */
  index: number;
  src: string;
  isGranted?: (char: CharInfo) => boolean;
};

export type ApplyCharBuffArgs = ApplyCharInnateBuffArgs & {
  inputs: ModifierInput[];
  fromSelf: boolean;
};

export type AbilityBuff = AbilityModifier & {
  affect: EModAffect;
  inputConfigs?: ModInputConfig[];
  infuseConfig?: {
    overwritable: boolean;
    range?: NormalAttack[];
    disabledNAs?: boolean;
  };
  description: number | string;
  applyBuff?: (args: ApplyCharBuffArgs) => void;
  applyFinalBuff?: (args: ApplyCharBuffArgs) => void;
};

// ============ DEBUFFS ============
type ApplyCharDebuffArgs = DebuffModifierArgsWrapper & {
  inputs: ModifierInput[];
  fromSelf: boolean;
  desc: string;
};

export type AbilityDebuff = AbilityModifier & {
  affect?: EModAffect;
  inputConfigs?: ModInputConfig[];
  description: number | string;
  applyDebuff?: (args: ApplyCharDebuffArgs) => void;
};

// ============ EXPERIMENTAL ============

export type GrantedAt = "A1" | "A4" | "C1" | "C2" | "C4" | "C6";

export type CharacterModifier = {
  src: string;
  grantedAt?: GrantedAt;
  description: string;
};

type CharacterInnateBonus = {
  value: number;
  extra?:
    | number
    | {
        value: number;
        grantedAt: GrantedAt;
      };
  stacks?: CharacterStackConfig | CharacterStackConfig[];
  targets: CharacterBonusTarget | CharacterBonusTarget[];
  max?: number;
};

type CharacterInnateBuff = CharacterModifier & {
  charBonuses: CharacterInnateBonus | CharacterInnateBonus[];
};

type InputStack = {
  type: "input";
  /** Default to 0 */
  index?: number;
  /** stacks = negativeMax - inputs. Only on Alhaitham */
  negativeMax?: number;
};

type AttributeStack = {
  type: "attribute";
  field: "hp" | "base_atk" | "def" | "em" | "er_";
  /** Default to 1 */
  // convertRate?: number;
};

type LevelStack = {
  type: "level";
  path: Talent;
};

type LevelScaleStack = {
  type: "level_scale";
  path: Talent;
  value: number;
};

/** Only on Charlotte */
type NationStack = {
  type: "nation";
  nation: "same" | "different";
};

export type CharacterStackConfig = InputStack | AttributeStack | LevelStack | LevelScaleStack | NationStack;

export type CharacterBonusTarget =
  | {
      type: "ATTR";
      path: AttributeStat | AttributeStat[];
    }
  | {
      type: "PATT";
      path: AttackPatternPath | AttackPatternPath[];
    }
  | {
      type: "ELMT";
      path: AttackElementPath | AttackElementPath;
    }
  | {
      type: "RXN";
      path: ReactionBonusPath | ReactionBonusPath[];
    }
  | {
      type: "ITEM";
      id: string | string[];
      path: AttackPatternInfoKey;
    }
  | {
      /** Only on Candace */
      type: "ELM_NA";
      path?: string; // dummy, @to-do: remove
    }
  | {
      /** Only on Dendro Traveler */
      type: "IN_ELM";
      path?: string; // dummy, @to-do: remove
    };

/** For input when used for teammates */
type TeammateInputCheck = {
  value: number;
  /** Default to 0 */
  index?: number;
};

export type CharacterBonus = CharacterInnateBonus & {
  grantedAt?: GrantedAt | TeammateInputCheck;
  /**  */
  checkInput?:
    | number
    | {
        value: number;
        /** Default to 0 */
        index?: number;
        /** Default to 'equal' */
        type?: "equal" | "min" | "max";
      };
  /** Only on Chongyun */
  weaponTypes?: WeaponType[];
  /** Default to true */
  fromSelf?: boolean;
};

type CharacterBuff = CharacterModifier & {
  index: number;
  affect: EModAffect;
  inputConfigs?: ModInputConfig[];
  infuseConfig?: {
    overwritable: boolean;
    range?: ("NA" | "CA" | "PA")[];
    disabledNAs?: boolean;
  };
  charBonuses?: CharacterBonus | CharacterBonus[];
};
