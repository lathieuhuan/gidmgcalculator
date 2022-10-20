import type { Artifact } from "@Src/types";

export type ModalType =
  | "CHARACTERS"
  | "WEAPONS"
  | Artifact
  | "SHARE_SETUP"
  | "NOTICE_MOVE_TARGET"
  | "";

export type ModalInfo = {
  type: ModalType;
  index?: number;
};
