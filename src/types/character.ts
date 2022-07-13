import { EModAffect } from "@Src/constants";
import type {
  AttackElement,
  AttackPattern,
  Vision,
  Nation,
  Rarity,
  Weapon,
  CharInfo,
  Tracker,
  ModifierInput,
  BaseStat,
  NormalAttack,
  ArtifactPercentStat,
} from "./global";
import type {
  CalcCharData,
  DefenseIgnore,
  FinalInfusion,
  ModifierCtrl,
  Party,
  PartyData,
  ReactionBonus,
  ResistanceReduction,
  AttackPatternBonus,
  AttackPatternInfoKey,
  TotalAttribute,
  AttackElementBonus,
} from "./calculator";

export type DataCharacter = {
  code: number;
  beta?: boolean;
  name: string;
  icon: string;
  sideIcon: string;
  rarity: Rarity;
  nation: Nation;
  vision: Vision;
  weapon: Weapon;
  stats: Record<BaseStat, number>[];
  bonusStats?: {
    type: AttackElement | ArtifactPercentStat | "em";
    value: number;
  }[];
  activeTalents: [NormalAttacks, ElementalSkill, ElementalBurst];
  passiveTalents: Ability[];
  constellation: Ability[];
  buffs?: AbilityBuff[];
  debuffs?: AbilityDebuff[];
};

export type DamageTypes = [AttackPattern | null, AttackElement | "various"];

export type TalentStatInfo = {
  name: string;
  noCalc?: boolean;
  isHealing?: boolean;
  dmgTypes?: DamageTypes;
  baseStatType?: "base_atk" | "atk" | "def" | "hp";
  baseMult: number | number[];
  multType: number;
  flat?: {
    base: number;
    type: number;
  };
  getTalentBuff?: (args: GetTalentBuffArgs) => TalentBuff | void;
  getLimit?: (args: { totalAttrs: TotalAttribute }) => number;
};

type NormalAttacks = {
  name: string;
  stats: TalentStatInfo[];
  caStamina: number;
};

type Ability = {
  name: string;
  image: string;
};

type GetTalentBuffArgs = {
  char: CharInfo;
  partyData: PartyData;
  totalAttrs: TotalAttribute;
  selfBuffCtrls: ModifierCtrl[];
  selfDebuffCtrls: ModifierCtrl[];
};

export type TalentBuff = Partial<Record<AttackPatternInfoKey, { desc: string; value: number }>>;

type ElementalSkill = Ability & {
  xtraLvAtCons: 3 | 5;
  stats: TalentStatInfo[];
};

type ElementalBurst = ElementalSkill & { energyCost: number };

type AbilityModifier = {
  index: number;
  outdated?: boolean;
  src: string;
  isGranted: (char: CharInfo) => boolean;
};

// BUFFS

// #to-do
type BuffInputRenderType = "select" | "";

export type AbilityBuff = AbilityModifier & {
  desc: () => JSX.Element;
  affect: EModAffect;
  inputConfig?: {
    labels?: string[];
    selfLabels?: string[];
    initialValues: ModifierInput[];
    renderTypes: BuffInputRenderType[];
    maxs?: (number | null)[];
  };
  infuseConfig?: {
    range: NormalAttack[];
    overwritable: boolean;
    isAppliable?: (charData: DataCharacter) => boolean;
  };
  applyBuff?: (args: ApplyCharBuffArgs) => void;
  applyFinalBuff?: (args: ApplyCharBuffArgs) => void;
};

type ApplyCharBuffArgs = {
  totalAttrs: TotalAttribute;
  attPattBonuses: AttackPatternBonus;
  attElmtBonuses: AttackElementBonus;
  rxnBonuses: ReactionBonus;
  char: CharInfo;
  charData: CalcCharData;
  party: Party;
  partyData: PartyData;
  inputs?: ModifierInput[];
  infusion: FinalInfusion;
  toSelf: boolean;
  charBuffCtrls: ModifierCtrl[];
  desc: string;
  tracker?: Tracker;
};

// DEBUFFS

export type DebuffInputRenderType = "absorption" | "text";

export type AbilityDebuff = AbilityModifier & {
  desc: () => JSX.Element;
  affect?: EModAffect;
  inputConfig?: {
    labels: string[];
    selfLabels?: string[];
    initialValues: ModifierInput[];
    renderTypes: DebuffInputRenderType[];
  };
  applyDebuff?: (args: {
    resistReduct: ResistanceReduction;
    defIgnore: DefenseIgnore;
    // #to-check
    // selfDebuffCtrls: ModifierCtrl[];
    char?: CharInfo;
    inputs?: ModifierInput[];
    fromSelf: boolean;
    desc?: string;
    tracker?: Tracker;
  }) => void;
};
