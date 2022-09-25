export type MySetupModalType =
  | "SHARE_SETUP"
  | "REMOVE_SETUP"
  | "COMBINE_MORE"
  | "FIRST_COMBINE"
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
