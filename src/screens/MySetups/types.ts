export type MySetupModalType =
  | "SHARE"
  | "REMOVE"
  | "ADD"
  | "COMBINE"
  | "STATS"
  | "MODIFIERS"
  | "WEAPON"
  | "ARTIFACTS"
  | "TIPS"
  | "";

export type MySetupModal = {
  type: MySetupModalType;
  ID?: number;
};
