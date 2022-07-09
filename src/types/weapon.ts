import type { AllStat, Tracker, Rarity, ModifierInput } from "./global";
import { EModAffect } from "@Src/constants";
import { PartyData, TotalAttribute } from "./calculator";

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
  applyBuff?: ApplyWpBuff;
  applyFinalBuff?: ApplyWpBuff;
  buffs: WeaponBuff[];
  passiveName: string;
  passiveDesc: (args: WpDescArgs) => {
    core: JSX.Element;
    extra?: JSX.Element[];
  };
};

export type ApplyWpBuff = (args: {
  totalAttrs: TotalAttribute;
  refi: number;
  inputs?: ModifierInput[];
  partyData?: PartyData;
  desc?: string;
  tracker?: Tracker;
}) => void;

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
  applyBuff: ApplyWpBuff;
  applyFinalBuff?: ApplyWpBuff;
  desc: (args: WpDescArgs) => JSX.Element;
};
