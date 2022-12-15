import type { ArtifactType } from "@Src/types";

export type ModalType =
  | "CHARACTERS"
  | "WEAPONS"
  | ArtifactType
  | "SHARE_SETUP"
  | "NOTICE_MOVE_TARGET"
  | "";

export type ModalInfo = {
  type: ModalType;
  index?: number;
};
