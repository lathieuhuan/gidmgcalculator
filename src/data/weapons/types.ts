import type { AllStat, Tracker, Rarity, ModAffect } from "@Src/types";

export interface IWeapon {
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
  addBuff: (args: AddBonusesArgs) => void;
  buffs: WeaponBuff[];
  passiveName: string;
  passiveDesc: (args: DescArgs) => {
    core: JSX.Element;
    extra?: JSX.Element[];
  };
}

export interface AddBonusesArgs {
  refinement: number;
  tkDesc: string;
  tracker: Tracker;
}

interface WeaponBuff {
  index: number;
  affect: ModAffect;
  addBuff: (args: AddBonusesArgs) => void;
  desc: (args: DescArgs) => JSX.Element;
}

interface DescArgs {
  refinement: number;
}
