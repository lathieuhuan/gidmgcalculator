import { EModAffect } from "@Src/constants";
import type { ModifierInput, Tracker } from "./global";
import type {
  CalcCharData,
  DefenseIgnore,
  ReactionBonus,
  ResistanceReduction,
  SkillBonus,
  TotalAttribute,
} from "./calculator";

type ArtPieceData = {
  name: string;
  icon: string;
};

export type DataArtifact = {
  code: number;
  beta?: boolean;
  name: string;
  variants: number[];
  flower: ArtPieceData;
  plume: ArtPieceData;
  sands: ArtPieceData;
  goblet: ArtPieceData;
  circlet: ArtPieceData;
  setBonuses: [SetBonus, SetBonus];
  buffs?: ArtifactBuff[];
  debuffs?: ArtifactDebuff[];
};

type ApplyArtPassiveBuffArgs = {
  totalAttrs: TotalAttribute;
  skillBonuses?: SkillBonus;
  rxnBonuses?: ReactionBonus;
  charData: CalcCharData;
  desc?: string;
  tracker?: Tracker;
};

type SetBonus = {
  desc: JSX.Element;
  applyBuff?: (args: ApplyArtPassiveBuffArgs) => void;
  applyFinalBuff?: (args: ApplyArtPassiveBuffArgs) => void;
};

type ApplyArtBuffArgs = {
  totalAttrs: TotalAttribute;
  skillBonuses: SkillBonus;
  rxnBonuses: ReactionBonus;
  charData: CalcCharData;
  inputs?: ModifierInput[];
  desc?: string;
  tracker?: Tracker;
};

type ApplyArtFinalBuffArgs = {
  totalAttrs: TotalAttribute;
  skillBonuses: SkillBonus;
  desc?: string;
  tracker?: Tracker;
};

type ArtifactBuff = {
  desc: () => JSX.Element;
  affect: EModAffect;
  inputConfig?: {
    labels: string[];
    initialValues: number[];
    renderTypes: ("stacks" | "")[];
    maxs: number[];
  };
  applyBuff?: (args: ApplyArtBuffArgs) => void;
  applyFinalBuff?: (args: ApplyArtFinalBuffArgs) => void;
};

type ArtifactDebuff = {
  desc: JSX.Element;
  labels: string[];
  inputTypes: "swirl"[];
  applyDebuff: (args: {
    resistReduct: ResistanceReduction;
    defIgnore: DefenseIgnore;
    inputs?: ModifierInput[];
    desc: string;
    tracker: Tracker;
  }) => void;
};
