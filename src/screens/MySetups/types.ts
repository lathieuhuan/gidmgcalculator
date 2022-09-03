export type MySetupModalType =
  | "SHARE_SETUP"
  | "REMOVE_SETUP"
  | "ADD_TO_COMPLEX"
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
