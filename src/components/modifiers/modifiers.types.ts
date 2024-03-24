import type { ModifierCtrl, Teammate } from "@Src/types";
import type { ModifierTemplateProps } from "../ModifierTemplate";

export type GetModifierHanldersArgs<T extends ModifierCtrl = ModifierCtrl> = {
  ctrl: T;
  ctrlIndex: number;
  ctrls: ModifierCtrl[];
};

export type GetTeammateModifierHanldersArgs = GetModifierHanldersArgs & {
  teammate: Teammate;
  teammateIndex: number;
};

export type ModifierHanlders = Pick<
  ModifierTemplateProps,
  "onToggle" | "onChangeText" | "onSelectOption" | "onToggleCheck"
>;