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
  /** Pre-calculated stack */
  stackModels?: CharacterStackConfig;
};

type CharacterInnateBonus = {
  value: number;
  stacks?: CharacterStackConfig | CharacterStackConfig[];
  targets: CharacterBonusTarget | CharacterBonusTarget[];
  max?: number;
};

type CharacterInnateBuff = CharacterModifier & {
  bonusModels?: CharacterInnateBonus | CharacterInnateBonus[];
};

type InputStack = {
  type: "input";
  /** Default to 0 */
  index?: number;
  /** When this bonus is from teammate, this is input's index to get stacks. */
  alterIndex?: number;
  /** On Furina */
  // extra?: {
  //   value: number;
  //   grantedAt?: GrantedAt;
  //   /** When this bonus is from teammate, this is input's index to check granted. */
  //   alterIndex?: number;
  // };
  /** On Neuvillette */
  requiredBase?: number;
  // /** On Furina */
  // max?: number;
};

type AttributeStack = {
  type: "attribute";
  field: "base_atk" | "hp" | "atk" | "def" | "em" | "er_" | "healB_";
  /** When this bonus is from teammate, this is input's index to get value. Default to 0 */
  alterIndex?: number;
  /** stack = attribute - required base. On Nahida */
  requiredBase?: number;
};

type NationStack = {
  /** On Charlotte */
  type: "nation";
  nation: "same" | "different";
};

type VisionStack = {
  /** On Gorou, Lynette */
  type: "vision";
  visionType: "various" | Vision;
  options: number[];
};

type OptionStack = {
  type: "option";
  /** stack = options[input - 1] */
  options: number[];
  /** Default to 0 */
  index?: number;
};

export type CharacterStackConfig = (InputStack | OptionStack | AttributeStack | NationStack | VisionStack) & {
  /** On Furina */
  extraStack?: {
    value: number;
    grantedAt?: GrantedAt;
    /** When this bonus is from teammate, this is input's index to check granted. */
    alterIndex?: number;
  };
  maxStack?: number;
};

export type CharacterBonusTarget =
  | {
      type: "ATTR";
      path: AttributeStat | AttributeStat[];
      /** On Hu Tao */
      maxMult?: number;
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
      /** On Candace */
      type: "ELM_NA";
      path?: string; // dummy, @to-do: remove
    }
  | {
      /** On Dendro Traveler, Kazuha, Sucrose */
      type: "IN_ELM";
      path?: string; // dummy, @to-do: remove
    };

export type CharacterBonus = CharacterInnateBonus & {
  grantedAt?: GrantedAt;
  /** When this bonus is from teammate, this is input's index to check granted. */
  alterIndex?: number;
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
  /** On Chongyun */
  forWeapons?: WeaponType[];
  /** On Chevreuse */
  forElmts?: Vision[];
  /** On Gorou, Nilou, Chevreuse */
  partyElmtCount?: Partial<Record<Vision, number>>;
  /** On Nilou, Chevreuse */
  partyOnlyElmts?: Vision[];
  /** Multiplier based on talent level */
  scale?: {
    talent: Talent;
    /**
     * If [value] = 0: buff value * level. Otherwise buff value * TALENT_LV_MULTIPLIERS[value][level].
     * number[] as options. Only on Razor.
     */
    value: number | number[];
    /** When this bonus is from teammate, this is input's index to get level. Default to 0 */
    alterIndex?: number;
  };
  /** Added before stacks, after scale */
  preExtra?:
    | number
    // On Bennett
    // | {
    //     value: number;
    //     grantedAt: GrantedAt;
    //     /** When this bonus is from teammate, this is input's index to check granted. */
    //     alterIndex?: number;
    //   };
    | Omit<CharacterBonus, "targets">;
  /** Index of pre-calculated stack */
  stackIndex?: number;
  /** Default to true */
  fromSelf?: boolean; // @to-do: only on Alhaitham, consider to remove
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
  bonusModels?: CharacterBonus | CharacterBonus[];
};
