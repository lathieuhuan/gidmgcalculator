import type { ReactNode } from "react";
import { EModAffect } from "@Src/constants";
import type { Tracker, Rarity, ArtifactPercentStat } from "./global";
import type {
  AttackPatternBonus,
  CharData,
  BuffModifierArgsWrapper,
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
  applyBuff?: (args: TApplyWpPassiveBuffsArgs) => void;
  applyFinalBuff?: (args: TApplyWpPassiveBuffsArgs) => void;
  passiveName: string;
  passiveDesc: (args: TWeaponDescArgs) => {
    core?: JSX.Element;
    extra?: JSX.Element[];
  };
  buffs?: TWeaponBuff[];
};

type TApplyWpPassiveBuffsArgs = {
  totalAttr: TotalAttribute;
  attPattBonus?: AttackPatternBonus;
  rxnBonus?: ReactionBonus;
  charData: CharData;
  partyData?: PartyData;
  refi: number;
  desc?: string;
  tracker?: Tracker;
};

type TApplyWpBuffArgs = BuffModifierArgsWrapper & {
  inputs?: ModifierInput[];
  refi: number;
  desc?: string;
};

type TApplyWpFinalBuffArgs = {
  totalAttr: TotalAttribute;
  refi: number;
  desc?: string;
  tracker?: Tracker;
  inputs?: ModifierInput[];
};

type TWeaponDescArgs = {
  refi: number;
};

export type TWeaponBuffInputRenderType = "text" | "check" | "choices" | "stacks";

type TWeaponBuff = {
  index: number;
  affect: EModAffect;
  inputConfig?: {
    labels: string[];
    renderTypes: TWeaponBuffInputRenderType[];
    initialValues: ModifierInput[];
    maxValues?: number[];
    options?: string[][];
  };
  applyBuff?: (args: TApplyWpBuffArgs) => void;
  applyFinalBuff?: (args: TApplyWpFinalBuffArgs) => void;
  desc: (
    args: TWeaponDescArgs & {
      totalAttr: TotalAttribute;
    }
  ) => ReactNode;
};
