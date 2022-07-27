import type { ReactNode } from "react";
import { EModAffect } from "@Src/constants";
import type { Tracker, Rarity, ArtifactPercentStat } from "./global";
import type {
  AttackPatternBonus,
  CalcCharData,
  ModifierInput,
  PartyData,
  ReactionBonus,
  TotalAttribute,
} from "./calculator";

export type DataWeapon = {
  code: number;
  beta?: boolean;
  name: string;
  rarity: Rarity;
  icon: string;
  mainStatScale: string;
  subStat?: {
    type: ArtifactPercentStat | "em" | "phys";
    scale: string;
  };
  applyBuff?: (args: ApplyWpPassiveBuffsArgs) => void;
  applyFinalBuff?: (args: ApplyWpPassiveBuffsArgs) => void;
  stackValues?: (args: { refi: number }) => number[];
  passiveName: string;
  passiveDesc: (args: WpDescArgs) => {
    core?: JSX.Element;
    extra?: JSX.Element[];
  };
  buffs?: WeaponBuff[];
};

type ApplyWpPassiveBuffsArgs = {
  totalAttr: TotalAttribute;
  attPattBonus?: AttackPatternBonus;
  rxnBonus?: ReactionBonus;
  charData: CalcCharData;
  partyData?: PartyData;
  refi: number;
  desc?: string;
  tracker?: Tracker;
};

type ApplyWpBuffArgs = {
  totalAttr: TotalAttribute;
  attPattBonus: AttackPatternBonus;
  rxnBonus: ReactionBonus;
  charData: CalcCharData;
  inputs?: ModifierInput[];
  refi: number;
  desc?: string;
  tracker?: Tracker;
};

type ApplyWpFinalBuffArgs = {
  totalAttr: TotalAttribute;
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
    renderTypes: ("stacks" | "check" | "choices")[];
    initialValues: ModifierInput[];
    maxValues?: number[];
  };
  applyBuff: (args: ApplyWpBuffArgs) => void;
  applyFinalBuff?: (args: ApplyWpFinalBuffArgs) => void;
  desc: (args: WpDescArgs) => ReactNode;
};
