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
} from "./calculator";
import { EModAffect } from "@Src/constants";

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
  innateBuffs?: InnateBuff[];
  buffs?: AbilityBuff[];
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

export type InnateBuff = {
  src: string;
  isGranted: (char: CharInfo) => boolean;
  description: number | string;
  applyBuff?: (args: ApplyCharInnateBuffArgs) => void;
  applyFinalBuff?: (args: ApplyCharInnateBuffArgs) => void;
};

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
