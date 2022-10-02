export type SettingsModalType =
  | "CONFIG_TIPS"
  | "SAVE_SETUP"
  | "SHARE_SETUP"
  | "UPDATE_USERS_DATA"
  | "";

export type SettingsModalInfo = {
  type: SettingsModalType;
  index: number | null;
};
