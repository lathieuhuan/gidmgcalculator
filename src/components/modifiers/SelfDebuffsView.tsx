import type { AppCharacter, CharInfo, ModifierCtrl, PartyData } from "@Src/types";
import type { GetModifierHanldersArgs, ModifierHanlders } from "./modifiers.types";
import { findByIndex, isGranted, parseAbilityDescription } from "@Src/utils";
import { ModifierTemplate } from "../ModifierTemplate";
import { renderModifiers } from "./modifiers.utils";

interface SelfDebuffsViewProps {
  mutable?: boolean;
  char: CharInfo;
  selfDebuffCtrls: ModifierCtrl[];
  appChar: AppCharacter;
  partyData: PartyData;
  getHanlders?: (args: GetModifierHanldersArgs) => ModifierHanlders;
}
export function SelfDebuffsView({
  mutable,
  char,
  selfDebuffCtrls,
  appChar,
  partyData,
  getHanlders,
}: SelfDebuffsViewProps) {
  const { debuffs = [] } = appChar;
  const content: JSX.Element[] = [];

  selfDebuffCtrls.forEach((ctrl, ctrlIndex) => {
    const debuff = findByIndex(debuffs, ctrl.index);

    if (debuff && isGranted(debuff, char)) {
      const { inputs = [] } = ctrl;

      content.push(
        <ModifierTemplate
          key={ctrl.index}
          mutable={mutable}
          heading={debuff.src}
          description={parseAbilityDescription(debuff, { char, appChar, partyData }, inputs, true)}
          checked={ctrl.activated}
          inputs={inputs}
          inputConfigs={debuff.inputConfigs?.filter((config) => config.for !== "team")}
          {...getHanlders?.({
            ctrl,
            ctrlIndex,
            ctrls: selfDebuffCtrls,
          })}
        />
      );
    }
  });

  return renderModifiers(content, "debuffs", false);
}
