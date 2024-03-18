import type { AppCharacter, CharInfo, ModifierCtrl, PartyData } from "@Src/types";
import type { GetModifierHanldersArgs, ModifierHanlders } from "./modifiers.types";
import { findByIndex, isGranted, parseAbilityDescription } from "@Src/utils";
import { ModifierTemplate } from "../ModifierTemplate";
import { renderModifiers } from "./modifiers.utils";

interface SelfBuffsViewProps {
  mutable?: boolean;
  char: CharInfo;
  appChar: AppCharacter;
  selfBuffCtrls: ModifierCtrl[];
  partyData: PartyData;
  getHanlders?: (args: GetModifierHanldersArgs) => ModifierHanlders;
}
export function SelfBuffsView({ mutable, char, appChar, selfBuffCtrls, partyData, getHanlders }: SelfBuffsViewProps) {
  const { innateBuffs = [], buffs = [] } = appChar;
  const content: JSX.Element[] = [];

  innateBuffs.forEach((buff, index) => {
    if (isGranted(buff, char)) {
      content.push(
        <ModifierTemplate
          key={"innate-" + index}
          mutable={false}
          heading={buff.src}
          description={parseAbilityDescription(buff, { char, appChar, partyData }, [], true)}
        />
      );
    }
  });

  selfBuffCtrls.forEach((ctrl, ctrlIndex) => {
    const buff = findByIndex(buffs, ctrl.index);

    if (buff && isGranted(buff, char)) {
      const { inputs = [] } = ctrl;

      content.push(
        <ModifierTemplate
          key={ctrl.index}
          mutable={mutable}
          heading={buff.src}
          description={parseAbilityDescription(buff, { char, appChar, partyData }, inputs, true)}
          checked={ctrl.activated}
          inputs={inputs}
          inputConfigs={buff.inputConfigs?.filter((config) => config.for !== "team")}
          {...getHanlders?.({ ctrl, ctrlIndex, ctrls: selfBuffCtrls })}
        />
      );
    }
  });

  return renderModifiers(content, "buffs", false);
}
