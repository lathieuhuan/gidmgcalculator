import { EModAffect } from "@Src/constants";
import type { AllStat, Tracker, Rarity, ModifierInput, PartiallyOptional } from "./global";
import type {
  CalcCharData,
  PartyData,
  ReactionBonus,
  SkillBonus,
  TotalAttribute,
} from "./calculator";

export type DataWeapon = {
  code: number;
  beta?: boolean;
  name: string;
  icon: string;
  rarity: Rarity;
  mainStatScale: string;
  subStat: {
    type: AllStat;
    scale: string;
  };
  applyBuff?: (args: ApplyWpPassiveBuffsArgs) => void;
  applyFinalBuff?: (args: ApplyWpPassiveBuffsArgs) => void;
  buffs: WeaponBuff[];
  passiveName: string;
  passiveDesc: (args: WpDescArgs) => {
    core: JSX.Element;
    extra?: JSX.Element[];
  };
};

type ApplyWpPassiveBuffsArgs = {
  totalAttrs: TotalAttribute;
  skillBonuses?: SkillBonus;
  rxnBonuses?: ReactionBonus;
  charData?: CalcCharData;
  partyData?: PartyData;
  refi: number;
  desc?: string;
  tracker?: Tracker;
};

type ApplyWpBuffArgs = {
  totalAttrs: TotalAttribute;
  skillBonuses: SkillBonus;
  rxnBonuses: ReactionBonus;
  charData: CalcCharData;
  inputs?: ModifierInput[];
  refi: number;
  desc?: string;
  tracker?: Tracker;
};

type ApplyWpFinalBuffArgs = {
  totalAttrs: TotalAttribute;
  refi: number;
  desc?: string;
  tracker?: Tracker;
};

type WpDescArgs = {
  refi: number;
};

type WeaponBuff = {
  index: number;
  outdated?: boolean;
  affect: EModAffect;
  inputConfig?: {
    labels: string[];
    initialValues: ModifierInput[];
    renderTypes: ("stacks" | "check" | "choices")[];
  };
  applyBuff: (args: ApplyWpBuffArgs) => void;
  applyFinalBuff?: (args: ApplyWpFinalBuffArgs) => void;
  desc: (args: WpDescArgs) => JSX.Element;
};
