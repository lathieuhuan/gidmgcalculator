interface PieceInfo {
  name: string;
  icon: string;
}

export interface IArtifact {
  code: number;
  beta?: boolean;
  name: string;
  variants: number[];
  flower: PieceInfo;
  plume: PieceInfo;
  sands: PieceInfo;
  goblet: PieceInfo;
  circlet: PieceInfo;
  setBnes: []
}