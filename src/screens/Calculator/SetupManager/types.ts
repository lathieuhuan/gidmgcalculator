import type { Artifact } from "@Src/types";

export type ModalType =
  | "CHARACTERS"
  | "WEAPONS"
  | Artifact
  | "SAVE_SETUP"
  | "SHARE_SETUP"
  // | "UPDATE_USERS_DATA"
  | "";

export type ModalInfo = {
  type: ModalType;
  index?: number;
};
